class User < ActiveRecord::Base
  validates :username, :password_digest, :email, :age, :session_token, presence: true
  validates :username, :email, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }

  attr_reader :password

  after_initialize :ensure_session_token

  has_many :reviews,
    class_name: :Review,
    primary_key: :id,
    foreign_key: :user_id

  def self.generate_session_token
    SecureRandom::urlsafe_base64(32)
  end

  def reset_session_token
    self.session_token = User.generate_session_token
    self.save
    self.session_token
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user && user.is_password?(password)
    user
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end
end
