class TopicsController < ApplicationController
  def index
    render json: { loggedIn: logged_in?, topics: Topic.pluck(:id, :title) }
  end

  def show
    topic = Topic.includes(:posts).find(params[:id])
    @post = topic.posts.includes(:sections, :tags).last
  
    render json: { 
      allTopicPosts: @post.try(:get_all_topic_posts) || [],
      post: {
        post: @post || [],
        related_posts: @post.try(:get_related_posts) || [],
        sections: @post.try {|post| post.sections.order(:position) } || [],
        tags: @post.try { |post| post.tags.pluck(:tag) } || []
      }
    }
  end

  def reload
    @topic = Topic.includes(:posts).find(params[:id])
    render json: { 
      allTopicPosts: @topic.posts.reverse,
      topicId: @topic.id,
      topicTitle: @topic.title.titleize,
    }
  end

  private

  def topic_params
    params.require(:topic).permit(:id)
  end
end