require 'faker'

["Ruby", "Javascript", "Postgresql", "React-Redux", "HTML-CSS", "Design-Patterns", "Algorithms-Math", "Miscellaneous"].each do |topic|
  Topic.create!(title: topic.downcase)
end

# section_types = %w[ruby javascript postgresql jsx html-css algorithms markdown]

# 300.times do
#   Post.create!(
#     topic_id: rand(1..8),
#     title: Faker::Hipster.sentence
#   )
# end

# 1100.times do
#   post_id = rand(1..300)
#   Section.create!(
#     post_id: post_id,
#     position: Post.find(post_id).sections.count + 1,
#     section_type: section_types.sample,
#     body: Faker::Hipster.paragraphs(number: rand(1..8)).pop,
#   )
#   Post.find(post_id).reload.sections.each(&:reload)
# end

# 800.times do
#   tag = Tag.find_or_create_by!(tag: [Faker::Company.industry, Faker::Artist.name, Faker::Superhero.power].sample)
#   post = Post.find(rand(1..300)) 
#   post.tags << tag unless PostTag.find_by(tag_id: tag.id, post_id: post.id)
# end