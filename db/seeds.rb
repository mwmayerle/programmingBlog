["Ruby", "Javascript", "Postgresql", "React-Redux", "HTML-CSS", "Design-Patterns", "Algorithms", "Miscellaneous"].each do |topic|
  Topic.create!(title: topic.downcase)
end