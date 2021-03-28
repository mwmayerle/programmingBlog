class User < ApplicationRecord
  has_secure_password
  validate :user_count

  private
  
  def user_count
    errors.add(:email, "Too many users") if User.count >= 1
  end
end
