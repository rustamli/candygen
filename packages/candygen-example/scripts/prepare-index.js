
module.exports = {
  run (data) {
    data.posts.forEach(post => {
      post.title = post.title.toUpperCase();
    });

    return {
      pages: [
        { posts: data.posts }
      ]
    }
  }
}