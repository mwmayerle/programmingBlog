class Topic < ApplicationRecord

  validates_presence_of :title
  
  has_many :posts

  enum title: [
    "ruby", "javascript", "postgresql", "react-redux", "html-css", "design-patterns", "algorithms", "miscellaneous"
  ]
end