class Tag < ApplicationRecord
  has_many :post_tags
  has_many :posts, through: :post_tags

  def self.remove_orphaned_tags(old_tag_ids, new_tag_ids, post_id)
    to_destroy = old_tag_ids.reject { |tag_id| new_tag_ids.include?(tag_id) }
  
    if to_destroy.present? # kill join table if we have tags to destroy. Used when editing only 
      PostTag.where(tag_id: to_destroy, post_id: post_id).destroy_all
    end
    # remove the tag if it has no associated posts
    Tag.where(id: old_tag_ids).each { |tag| tag.destroy if tag.post_ids.empty? }
  end
end