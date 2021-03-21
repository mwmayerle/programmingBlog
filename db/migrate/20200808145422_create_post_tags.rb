class CreatePostTags < ActiveRecord::Migration[6.0]
  def change
    create_table :post_tags do |t|
      t.integer  :post_id
      t.integer  :tag_id
    end
    
    add_index(:post_tags, :post_id)
    add_index(:post_tags, :tag_id)
  end
end
