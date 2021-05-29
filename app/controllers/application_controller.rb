class ApplicationController < ActionController::Base

  def authorize
    unless logged_in?
      render json: {
        post: nil,
        related_posts: [],
        sections: [],
        tags: []
      }, status: :unauthorized
    end
  end

  def authorized_user?
    @user == current_user
  end

  def current_user
    return false if session[:user_id].nil?
    @current_user ||= User.find(session[:user_id])
  end

  def logged_in?
    !!current_user
  end
end
