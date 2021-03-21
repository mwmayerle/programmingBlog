class Post < ApplicationRecord
  belongs_to :topic, required: true

  has_many :sections
  has_many :post_tags
  has_many :tags, through: :post_tags

  validates_presence_of :title

  def get_related_posts
    Post.where(id: PostTag.where(tag_id: self.tag_ids).select(:post_id)).pluck(:id, :title)
  end

end