require 'faker'

["Ruby", "Javascript", "Postgresql", "React-Redux", "HTML-CSS", "Design-Patterns", "Algorithms-Math", "Miscellaneous"].each do |topic|
  Topic.create!(title: topic.downcase)
end