class Section < ApplicationRecord
  belongs_to :post

  # Create the sections for a newly created post
  def self.create_sections_from_params(section_params, post)
    section_params.each do |section|
      post.sections << Section.create!(
        body: section[:body],
        section_type: section[:section_type],
        position: section[:position],
        post_id: post.id
      )
    end
  end
end