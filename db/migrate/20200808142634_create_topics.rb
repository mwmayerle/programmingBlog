class CreateTopics < ActiveRecord::Migration[6.0]
  def change
    create_table :topics do |t|
      t.integer   :title
      t.timestamps
    end
  end
end
