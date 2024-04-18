import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: "You are not logged in.",
      postContent: "",
      postsByUser: {}, // Initialize as an empty object
      posts: [],
      showProfile: false, // Add this state
      redirectToProfile: false,
    };
    this.redirectToProfile = this.redirectToProfile.bind(this);

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handlePostContentChange = this.handlePostContentChange.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
  }
  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts() {
    axios
      .get("http://localhost:3001/api/posts") // Replace with your API endpoint
      .then((response) => {
        // Group posts by user
        const postsByUser = {};
        response.data.forEach((post) => {
          const userId = post.user.id;
          console.log("userId:", userId);

          if (!postsByUser[userId]) {
            postsByUser[userId] = {
              user: post.user,
              posts: [],
            };
          }

          postsByUser[userId].posts.push(post);
        });

        this.setState({ postsByUser });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }

  handlePostContentChange = (e) => {
    this.setState({ postContent: e.target.value });
  };

  handlePostSubmit = () => {
    const { token } = this.props;
    const { postContent } = this.state;

    if (token) {
      // Set up the headers with the Bearer token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Define the post data
      const postData = {
        post: {
          // This structure matches the strong parameters defined in your Rails controller
          content: postContent,
        },
      };

      // Make the API request with the headers
      axios
        .post("http://localhost:3001/api/users/baslat_post", postData, {
          headers,
        })
        .then((response) => {
          // Handle the response, e.g., clear the input field or update the post list
          console.log("Post created successfully!");
          this.setState({ postContent: "" });
          this.fetchPosts();
        })
        .catch((error) => {
          // Handle the error, possibly unauthorized (401)
          console.error("Error creating post:", error);
        });
    } else {
      // Handle the case where no token is available
      console.error("No token available. User is not authenticated.");
    }
  };

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  handleLogout() {
    this.setState({
      loggedInStatus: "You are not logged in.",
    });
    this.props.history.push("/");
  }
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Call the function to submit the form when Enter is pressed
      this.handlePostSubmit();
    }
  };
  handleLogoutClick() {
    axios
      .delete("http://localhost:3001/logout", { withCredentials: true })
      .then((response) => {
        localStorage.removeItem("token");
        this.handleLogout();
        window.location.reload();
      })
      .catch((error) => {
        console.log("Logout error", error);
      });
  }
  redirectToProfile() {
    this.setState({ redirectToProfile: true });

    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
  render() {
    if (this.state.redirectToProfile) {
      return <Redirect to="/profile" />;
    }
    const { postContent, postsByUser } = this.state;

    return (
      <div className="div-main">
        <div className="dashboard-container">
          <h1>Masiro</h1>
          <h1>Dashboard</h1>
        </div>
        <div className="profile-status-container">
          <h1>Status: {this.props.loggedInStatus}</h1>
          <button
            onClick={this.redirectToProfile}
            type="submit"
            className="button-52"
          >
            Profile
          </button>
        </div>

        <div className="div-post">
          <h2 id="h2-post">Post</h2>
          <input
            type="text"
            className="input-post"
            required
            placeholder="Write your post"
            value={postContent}
            onChange={this.handlePostContentChange}
            onKeyPress={this.handleKeyPress}
          />
          <button
            onClick={this.handlePostSubmit}
            type="submit"
            className="button-52"
          >
            Send
          </button>
        </div>
        <button
          onClick={() => this.handleLogoutClick()}
          type="submit"
          className="button-52"
        >
          Logout
        </button>
        <div className="posts">
          <h2 id="posts">Posts</h2>
          {Object.entries(postsByUser).map(([userId, userData]) => (
            <div className="user-post-container" key={userId}>
              <h2 className="user-name-header">User {userId}'s Posts:</h2>
              <ul>
                {userData.posts.map((post) => (
                  <div
                    className={`post-container post-${userData.user.id}-${post.id}`}
                    key={post.id}
                  >
                    <p className="user-post">{post.content}</p>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
