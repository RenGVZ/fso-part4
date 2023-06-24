const dummy = (blogs) => {
  console.log(blogs)
  return 1
}


const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  let favBlog = []

  blogs.forEach(blog => {
    if(blog.likes > maxLikes) {
      maxLikes = blog.likes
      favBlog = blog
    }
  })

  return favBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}