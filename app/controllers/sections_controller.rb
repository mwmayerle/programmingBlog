class SectionsController < ApplicationController
  before_action :authorize

  # updates individual sections from drag and drop motions
  def update_positions
    section_data = section_params.to_h

    new_sections = section_data[:positionData].select { |new_section| new_section[:id].to_s.match?(/NEWPOST$/) }
    if new_sections
      new_sections.each do |new_section| 
        Section.create(
          post_id: section_params[:post][:postId], body: new_section[:body],
          section_type: new_section[:section_type], position: new_section[:position]
      )
      end
    end

    sections = Section.where(id: section_data[:positionData].map { |section| section[:id] })

    Section.transaction do
      sections.each do |section|
        param_data = section_data[:positionData].find { |param_datum| param_datum[:id] == section.id }

        section.body = param_data[:body]
        section.position = param_data[:position]
        section.section_type = param_data[:section_type]
        section.save!
      end
    end

    @post = Post.eager_load(:sections, :tags).find(section_params[:post][:postId])

    @related_posts = Post.where(id: PostTag.where(tag_id: @post.tag_ids).select(:post_id)).pluck(:id, :title)

    render json: { 
      post: @post,
      related_posts: @related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag)
    }
  end

  def destroy
    section = Section.find(section_params[:section][:id])
    deleted_section_position = section.position

    Section.where('post_id = ? and position > ?', section_params[:post][:postId], deleted_section_position).each do |section|
      section.position = deleted_section_position
      section.save!
      deleted_section_position += 1
    end

    section.destroy!

    @post = Post.eager_load(:sections, :tags).find(section_params[:post][:postId])
    @related_posts = Post.where(id: PostTag.where(tag_id: @post.tag_ids).pluck(:post_id)).pluck(:id, :title)

    render json: { 
      post: @post,
      related_posts: @related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag),
    }
  end

  private
    def section_params
      params.permit(:id, :positionData => [:id, :body,:position, :section_type], :section => [:id], :post => [:postId])
    end
end