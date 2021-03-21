Rails.application.routes.draw do
  root 'users#index'

  resources :topics, only: [:index, :show, :reload]
  resources :posts, only: [:create, :show, :update, :destroy]
  
  get '/topics/reload/:id', to: 'topics#reload'
  put 'sections', to: 'sections#update_positions'
  delete '/sections/:id', to: 'sections#destroy'
end
