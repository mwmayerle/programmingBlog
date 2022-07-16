require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validations" do
    describe "#user_count" do
      let!(:user) { User.create(email: "radAdmin@aol.com", password: "password") }
      let!(:new_user) { User.new(email: "fartsMcgee@aol.com", password: "securitah") }

      it "has a valid setup" do
        expect(User.count).to eq(1)
      end

      it "does not allow more than 1 user to exist" do
        expect { new_user.save! }.to raise_error(ActiveRecord::RecordInvalid)
      end
    
      it "adds an error to the errors model" do
        expect(new_user.valid?).to be(false)
        expect(new_user.errors.full_messages).to eq(["Email Too many users"])
      end
    end
  end
end