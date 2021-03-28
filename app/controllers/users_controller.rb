class UsersController < ApplicationController
  before_action :authorize, only: [:sign_out]

  def index
  end

  def sign_in # post request
  end

  def log_in # get request for form
    @user = User.find_by(email:params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
    end
    render json: { loggedIn: authorized_user? }
  end

  def log_out # delete
    session[:user_id] = nil
    head :ok
  end
end
