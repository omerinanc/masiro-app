import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userPosts: [],
      userId: null,
      token: null,
      redirectToDashboard: false,
      editPostId: null, // Track the ID of the post being edited
      editedPostContent: "", // Store the edited post content
    };
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
    this.handleEditInputChange = this.handleEditInputChange.bind(this);
  }

  componentDidMount() {
    const storedUserData = localStorage.getItem("userData");
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    if (userData) {
      const loggedInUserId = userData.id; // Access the user ID from the user data
      console.log("Logged-in User ID:", loggedInUserId);
      this.fetchUserPosts(loggedInUserId); // Fetch user posts using the ID
    }
  }
  redirectToDashboard() {
    this.setState({ redirectToDashboard: true });

    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
  fetchUserPosts(loggedInUserId) {
    const storedToken = localStorage.getItem("userResponseToken");
    const token = storedToken ? JSON.parse(storedToken) : null;
    console.log(token);
    if (token) {
      axios
        .get(`http://localhost:3001/api/posts?user_id=${loggedInUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userPosts = response.data; // Update userPosts with response.data
          this.setState({ userPosts });
        })
        .catch((error) => {
          console.error("Error fetching user posts:", error);
        });
    }
  }
  deletePost(postId) {
    const { token } = this.state;

    axios
      .delete(`http://localhost:3001/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Post deleted successfully");
        // After successful deletion, you may want to update the state to reflect the changes.
        this.setState((prevState) => ({
          userPosts: prevState.userPosts.filter((post) => post.id !== postId),
        }));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
  // Function to handle editing
  editPost(postId, content) {
    this.setState({
      editPostId: postId,
      editedPostContent: content,
    });
  }

  // Function to handle canceling editing
  cancelEdit() {
    this.setState({
      editPostId: null,
      editedPostContent: "",
    });
  }
  // Function to handle editing
  handleEditInputChange(event) {
    const { value } = event.target;

    this.setState({
      editedPostContent: value,
    });
  }

  // Function to handle updating the edited post
  updatePost(postId) {
    const { token, editedPostContent } = this.state;
    axios
      .put(
        `http://localhost:3001/api/posts/${postId}`,
        { content: editedPostContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Post updated successfully");
        // After successful update, you may want to update the state to reflect the changes.
        this.setState((prevState) => ({
          userPosts: prevState.userPosts.map((post) => {
            if (post.id === postId) {
              return { ...post, content: editedPostContent };
            }
            return post;
          }),
          editPostId: null,
          editedPostContent: "",
        }));
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  }
  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect to="/dashboard" />;
    }
    const { userPosts, editPostId, editedPostContent } = this.state;

    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile</h1>
          <div>
            <h2 className="user-name-header">Your Posts:</h2>
            <ul>
              {userPosts.map((post) => (
                <div
                  className={`post-container post-${post.user.id}-${post.id}`}
                  key={post.id}
                >
                  <div className="user-post">
                    {editPostId === post.id ? (
                      <div className="deneme">
                        <textarea
                          value={editedPostContent}
                          onChange={this.handleEditInputChange}
                          className="user-post-edit"
                        />
                        <div className="edit-delete-button">
                          <button
                            onClick={() => this.updatePost(post.id)}
                            className="update-button"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => this.cancelEdit()}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {post.content}
                        <div className="edit-delete-button">
                          <button
                            onClick={() => this.editPost(post.id, post.content)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => this.deletePost(post.id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </ul>
          </div>

          <button
            onClick={this.redirectToDashboard}
            type="submit"
            className="button-52"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }
}
