class PostsController < ApplicationController
  before_action :authorize, except: [:show]

  def create
    Post.transaction do
      @post = Post.create!(post_params.except(:sections, :tags))
      # Create all Tags and PostTags
      Tag.create_tags_from_params(post_params[:tags], @post)
      # Create all the Sections
      Section.create_sections_from_params(post_params[:sections], @post)
    end
    
    @post.reload
    render json: {
      post: @post,
      related_posts: @post.get_related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag)
    }
  end

  def show
    @post = Post.eager_load(:sections, :topic, :tags).find(params[:id])
    render json: {
      allTopicPosts: @post.get_all_topic_posts,
      post: @post,
      related_posts: @post.get_related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag),
      topicTitle: @post.topic.title.titleize
    }
  end

  def update
    @post = Post.eager_load(:sections, :tags).find(post_params[:id])

    Post.transaction do
      # create all of the tags
      new_tag_ids = []
      post_params[:tags].split(',').map(&:strip).each do |tag|
        new_post_tag = PostTag.find_or_create_by(
          tag_id: Tag.find_or_create_by(tag: tag).id,
          post_id: @post.id
        )
        new_tag_ids << new_post_tag.tag_id
      end

      #remove unused post_tags
      Tag.remove_orphaned_tags(@post.tag_ids, new_tag_ids, @post.id)

      # deal with the post sections
      post_params[:sections].each do |section| # edit sections
        post_section = @post.sections.find { |sec| sec.id == section[:id] }
        # If the id is an insane number like a unix timestamp it's new
        post_section = Section.new if post_section.nil?
        post_section.post_id = @post.id
        post_section.body = section[:body]
        post_section.position = section[:position]
        post_section.section_type = section[:section_type]
        post_section.save!
      end

      #alter post attributes
      @post.update!(post_params.except(:sections, :tags))
    end

    @post.reload
    @related_posts = @post.get_related_posts

    render json: {
      post: @post,
      related_posts: @related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag)
    }
  end

  def destroy
    @post = Post.eager_load(:sections, :tags).find(post_params[:id])
    @topic_id = @post.topic_id
    # Remove any tags associated with the post that aren't being used elsewhere
    Post.transaction do
      Tag.remove_orphaned_tags(@post.tag_ids, [], @post.id)
      @post.sections.destroy_all
      @post.destroy!
    end

    render json: {
      allTopicPosts: @post.get_all_topic_posts,
      topicTitle: Topic.find(@post.topic_id).title,
      topicId: @post.topic_id
    }
  end

  private
    def post_params
      params.require(:post).permit(:id, :topic_id, :tags, :title, :sections => [
        :body, :id, :position, :section_type, :created_at, :updated_at, :post_id
      ])
    end
end