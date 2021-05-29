class UsersController < ApplicationController
  def index
    @logged_in = logged_in?
  end

  def sign_in # post request
  end

  def log_in # get request for form
    @user = User.find_by(email:params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      log_dashes
      p "Successfully logged in #{@user.email}"
      log_dashes
    end
    render json: { loggedIn: authorized_user? }
  end

  def log_out # delete
    session[:user_id] = nil
    log_dashes
    p "#{@user.email} successfully logged out"
    log_dashes
    head :ok
  end

  private

  def log_dashes
    p "-" * 66
  end
end
