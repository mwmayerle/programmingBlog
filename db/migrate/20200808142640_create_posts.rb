class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.integer  :topic_id
      t.string  :title
      t.timestamps
    end

    add_index(:posts, :topic_id)
  end
end
