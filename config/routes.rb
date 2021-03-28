Rails.application.routes.draw do
  root 'users#index'

  resources :topics, only: [:index, :show, :reload]
  resources :posts, only: [:create, :show, :update, :destroy]
  
  # I don't feel like making a SessionsController. Judge me
  get '/sign_in', to: 'users#sign_in'
  post '/sign_in', to: 'users#log_in'
  delete '/sign_out', to: 'users#log_out'

  get '/topics/reload/:id', to: 'topics#reload'
  put 'sections', to: 'sections#update_positions'
  delete '/sections/:id', to: 'sections#destroy'
end
