class CreateSection < ActiveRecord::Migration[6.0]
  def change
    create_table :sections do |t|
      t.integer  :post_id
      t.integer  :position
      t.string   :section_type
      t.text     :body
      t.timestamps
    end
    add_index(:post_id)
  end
end
