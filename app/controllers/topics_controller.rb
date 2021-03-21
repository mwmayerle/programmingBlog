class TopicsController < ApplicationController
  def index
    render json: Topic.pluck(:id, :title)
  end

  def show
    @all_topic_posts = Post.where(topic_id: params[:id]).reverse
    topic = Topic.find(params[:id])
    if topic.posts.any?
      @post = topic.posts.last
      @related_posts = @post.get_related_posts
  
      render json: { 
        allTopicPosts: @all_topic_posts,
        post: {
          post: @post,
          related_posts: @related_posts,
          sections: @post.sections.order(:position),
          tags: @post.tags.pluck(:tag)
        }
      }
    else
      render json: { 
        allTopicPosts: [],
        post: {
          post: [],
          related_posts: [],
          sections: [],
          tags: []
        }
      }
    end
  end

  def reload
    @topic = Topic.includes(:posts).find(params[:id])
    render json: { 
      allTopicPosts: @topic.posts.reverse,
      topicId: @topic.id,
      topicTitle: @topic.title,
    }
  end

  private

  def topic_params
    params.require(:topic).permit(:id)
  end
end