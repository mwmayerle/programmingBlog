class ApplicationController < ActionController::Base

  def authorize
    !!current_user
  end

  def authorized_user?
    @user == current_user
  end

  def current_user
    return false if session[:user_id].nil?
    @current_user ||= User.find(session[:user_id])
  end
end
