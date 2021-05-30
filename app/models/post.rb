class Post < ApplicationRecord
  belongs_to :topic, required: true

  has_many :sections
  has_many :post_tags
  has_many :tags, through: :post_tags

  validates_presence_of :title

  def get_all_topic_posts
    Post.where(topic_id: self.topic_id).reverse
  end

  def get_related_posts
    Post.where(
      id: PostTag.where(tag_id: self.tag_ids)
                 .where.not(post_id: self.id)
                 .select(:post_id)
    ).pluck(:id, :title)
  end

end