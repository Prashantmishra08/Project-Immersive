import User from "../models/user.models.js";
import Post from "../models/post.model.js";
import { Subscription } from "../models/followers.model.js";

// Fetch user details, excluding password
export const getUserDetails = async (userId) => {
  const userDetails = await User.findById(userId).select('-password');
  return userDetails;
};

// Fetch total posts count of user
export const getTotalPosts = async (userId) => {
  const postCount = await Post.countDocuments({ userId });
  return postCount;
};

// Fetch followers count
export const getFollowersCount = async (userId) => {
  const followersCount = await Subscription.countDocuments({ channel: userId });
  return followersCount;
};

// Fetch following count
export const getFollowingCount = async (userId) => {
  const followingCount = await Subscription.countDocuments({ subscriber: userId });
  return followingCount;
};
