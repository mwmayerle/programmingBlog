class SectionsController < ApplicationController
  before_action :authorize
  # updates individual sections from drag and drop motions
  def update_positions
    section_data = section_params.to_h

    if section_params[:post][:postId] # is the post created yet?
      new_sections = section_data[:positionData].select do |new_section| 
        new_section[:id].to_s.match?(/NEWPOST$/)
      end

      if new_sections.present?
        new_sections.each do |new_section| 
          Section.create!(
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

    else # create the new post with the sections in the order they arrived
      Post.transaction do
        @post = Post.create!(section_data[:post].except(:tags))
        # Create all Tags and PostTags
        Tag.create_tags_from_params(section_data[:post][:tags], @post)
        # Create all the Sections
        Section.create_sections_from_params(section_data[:positionData], @post)
      end
      @post.reload
    end


    if section_params[:post][:postId]
      @post = Post.eager_load(:sections, :tags).find(section_params[:post][:postId])
    end

    render json: { 
      post: @post,
      related_posts: @post.get_related_posts,
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

    render json: { 
      post: @post,
      related_posts: @post.get_related_posts,
      sections: @post.sections.order(:position),
      tags: @post.tags.pluck(:tag),
    }
  end

  private
    def section_params
      params.permit(:id, :positionData => [:id, :body,:position, :section_type], 
      :section => [:id], :post => [:postId, :tags, :title, :topic_id])
    end
end