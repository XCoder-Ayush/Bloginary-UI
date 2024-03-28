// Fetching Blog Id From URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const blogId = getParameterByName("id");
// console.log("Blog ID:", blogId);
// const blogId='65faf5d07611a728ca503359';
fetchBlog(blogId);

function generateBlogContent(blogData) {
  const blogContentSection = document.createElement("section");
  blogContentSection.classList.add("blog-content");

  const categoryWrapperDiv = document.createElement("div");
  categoryWrapperDiv.classList.add("category-wrapper");

  blogData.categories.forEach((category) => {
    const categoryBtn = document.createElement("button");
    categoryBtn.classList.add("category-btn");
    categoryBtn.textContent = category.name;
    categoryWrapperDiv.appendChild(categoryBtn);
  });

  const blogTitleDiv = document.createElement("div");
  blogTitleDiv.classList.add("blog-title");
  const titleHeading = document.createElement("h1");
  titleHeading.style.fontWeight = "600";
  titleHeading.style.fontSize = "48px";
  titleHeading.textContent = blogData.title;
  blogTitleDiv.appendChild(titleHeading);
  const blogMetaDiv = document.createElement("div");
  blogMetaDiv.classList.add("blog-meta");
  const profileWrapperDiv = document.createElement("div");
  profileWrapperDiv.classList.add("profile-wrapper");
  const profilePicDiv = document.createElement("div");
  profilePicDiv.classList.add("profile-pic");
  const profileImg = document.createElement("img");
  profileImg.src = blogData.profilePicSrc;
  profileImg.alt = "";
  profilePicDiv.appendChild(profileImg);

  const blogWriterDiv = document.createElement("div");
  blogWriterDiv.classList.add("blog-writer");
  blogWriterDiv.textContent = blogData.author;
  profileWrapperDiv.appendChild(profilePicDiv);
  profileWrapperDiv.appendChild(blogWriterDiv);
  const blogDateDiv = document.createElement("div");
  blogDateDiv.classList.add("blog-date");
  blogDateDiv.textContent = blogData.date;
  blogMetaDiv.appendChild(profileWrapperDiv);
  blogMetaDiv.appendChild(blogDateDiv);

  const imageWrapperDiv = document.createElement("div");
  imageWrapperDiv.classList.add("image-wrapper");
  const image = document.createElement("img");
  image.src = blogData.imageSrc;
  image.alt = "";
  imageWrapperDiv.appendChild(image);

  const blogTextDiv = document.createElement("div");
  blogTextDiv.classList.add("blog-text");
  blogTextDiv.textContent = blogData.content;

  const blogSocialDiv = document.createElement("div");
  blogSocialDiv.classList.add("blog-social");
  const likeDiv = document.createElement("div");
  likeDiv.classList.add("like");
  const likeIcon = document.createElement("i");
  likeIcon.classList.add("fa-regular", "fa-heart");
  likeIcon.id = "like-icon";
  const likeSpan1 = document.createElement("span");
  likeSpan1.classList.add("like-span");
  likeSpan1.textContent = "Likes";
  const likeSpan2 = document.createElement("span");
  likeSpan2.classList.add("like-count");
  likeDiv.appendChild(likeIcon);
  likeDiv.appendChild(likeSpan1);
  likeDiv.appendChild(likeSpan2);

  const commentIconWrapperDiv = document.createElement("div");
  commentIconWrapperDiv.classList.add("comment-icon-wrapper");
  const commentIcon = document.createElement("i");
  commentIcon.classList.add("fa-regular", "fa-comment");
  commentIcon.id = "comment-icon";
  const commentSpan1 = document.createElement("span");
  commentSpan1.classList.add("comment-span");
  commentSpan1.textContent = "Comments";
  const commentSpan2 = document.createElement("span");
  commentSpan2.classList.add("comment-count");
  commentIconWrapperDiv.appendChild(commentIcon);
  commentIconWrapperDiv.appendChild(commentSpan1);
  commentIconWrapperDiv.appendChild(commentSpan2);
  blogSocialDiv.appendChild(likeDiv);
  blogSocialDiv.appendChild(commentIconWrapperDiv);

  //   const commentsContainerDiv = document.createElement("div");
  //   commentsContainerDiv.classList.add("comments-container");
  //   const commentsDividerDiv = document.createElement("div");
  //   commentsDividerDiv.style.border = "1px solid #e1e1e1";
  //   const commentsHeading = document.createElement("h2");
  //   commentsHeading.textContent = "Comments";
  //   const commentListDiv = document.createElement("div");
  //   commentListDiv.id = "commentList";
  //   const writeCommentDiv = document.createElement("div");
  //   writeCommentDiv.classList.add("write-comment");
  //   const userImage = document.createElement("img");
  //   userImage.id = "userImage";

  //   userImage.src = blogData.imageSrc;

  //   userImage.alt = "";
  //   const commentInput = document.createElement("textarea");
  //   commentInput.id = "commentInput";
  //   commentInput.placeholder = "Write a comment...";
  //   const commentButton = document.createElement("button");
  //   commentButton.textContent = "Post Comment";
  //   commentButton.classList.add("comment-btn");
  //   commentButton.onclick = addComment; // assuming addComment is a defined function
  //   writeCommentDiv.appendChild(userImage);
  //   writeCommentDiv.appendChild(commentInput);
  //   writeCommentDiv.appendChild(commentButton);
  //   commentsContainerDiv.appendChild(commentsDividerDiv);
  //   commentsContainerDiv.appendChild(commentsHeading);
  //   commentsContainerDiv.appendChild(commentListDiv);
  //   commentsContainerDiv.appendChild(writeCommentDiv);

  blogContentSection.appendChild(categoryWrapperDiv);
  blogContentSection.appendChild(blogTitleDiv);
  blogContentSection.appendChild(blogMetaDiv);
  blogContentSection.appendChild(imageWrapperDiv);
  blogContentSection.appendChild(blogTextDiv);
  blogContentSection.appendChild(blogSocialDiv);
  //   blogContentSection.appendChild(commentsContainerDiv);

  return blogContentSection;
}
let blog=undefined
async function fetchBlog(blogId) {
  const resp = await fetch(`http://localhost:3001/api/v1/blog/${blogId}`);
  blog = await resp.json();
  console.log(blog);

  let categories = [];
  await Promise.all(
    blog.categories.map(async (categoryId) => {
      const resp = await fetch(
        `http://localhost:3001/api/v1/category/${categoryId}`
      );
      const category = await resp.json();
      categories.push(category);
    })
  );

  console.log(categories);

  const blogData = {
    imageSrc: blog.imageURL,
    categories: categories,
    title: blog.title,
    content: blog.content,
    profilePicSrc: blog.authorProfilePictureURL,
    author: blog.authorFirstName + " " + blog.authorLastName,
    date: formatMongoDate(blog.createdAt),
    id: blog._id,
  };
  console.log(blogData);
  const blogSectionDOMElement = generateBlogContent(blogData);
  // document.querySelector('.blog-entry').appendChild(blogSectionDOMElement)
}

function formatMongoDate(createdAt) {
  // Convert MongoDB date string to Date object
  const date = new Date(createdAt);

  // Define month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get components of the date
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Construct the formatted date string
  const formattedDate = monthNames[monthIndex] + " " + day + ", " + year;

  return formattedDate;
}

function createComment(authorName, commentContent, timestamp, likesCount) {
  var commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  var metaInfoDiv = document.createElement("div");
  metaInfoDiv.classList.add("meta-info");
  var authorImgWrapperDiv = document.createElement("div");
  authorImgWrapperDiv.classList.add("author-img-wrapper");
  var authorImg = document.createElement("img");
  authorImg.src = "../images/Image.png";
  authorImg.alt = "Author Image";
  authorImgWrapperDiv.appendChild(authorImg);
  metaInfoDiv.appendChild(authorImgWrapperDiv);
  var authorInfoDiv = document.createElement("div");
  authorInfoDiv.classList.add("author-info");
  var authorNameDiv = document.createElement("div");
  authorNameDiv.classList.add("author-name");
  authorNameDiv.textContent = authorName;
  var commentTimestampDiv = document.createElement("div");
  commentTimestampDiv.classList.add("comment-timestamp");
  commentTimestampDiv.textContent = timestamp;
  authorInfoDiv.appendChild(authorNameDiv);
  authorInfoDiv.appendChild(commentTimestampDiv);
  metaInfoDiv.appendChild(authorInfoDiv);
  commentDiv.appendChild(metaInfoDiv);
  var contentDiv = document.createElement("div");
  contentDiv.classList.add("content");
  contentDiv.textContent = commentContent;
  commentDiv.appendChild(contentDiv);
  var reactionsDiv = document.createElement("div");
  reactionsDiv.classList.add("reactions");
  var loveIconDiv = document.createElement("div");
  loveIconDiv.classList.add("love-icon");
  var heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");
  var likesSpan = document.createElement("span");
  likesSpan.textContent = likesCount;
  loveIconDiv.appendChild(heartIcon);
  loveIconDiv.appendChild(likesSpan);
  reactionsDiv.appendChild(loveIconDiv);
  var replyOpenerDiv = document.createElement("div");
  replyOpenerDiv.classList.add("reply-opener");
  replyOpenerDiv.textContent = "Reply";
  reactionsDiv.appendChild(replyOpenerDiv);
  commentDiv.appendChild(reactionsDiv);
  var commentsContainer = document.querySelector(".comments");
  commentsContainer.prepend(commentDiv);
}
function formatTimestamp(timestamp) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero for minutes less than 10
  return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
}

function postComment() {
  // API Call To Post The Comment:
  const commentContent = document.querySelector("#comment-input").value;
  // console.log(commentContent);
  createComment("Ayush Sharma", commentContent, formatTimestamp(Date.now()), 0);
  // If Success, Append To The DOM:
}
document.querySelector(".comment-btn").addEventListener("click", postComment);

document.querySelector("#like-icon").addEventListener("click", registerLike);

function registerLike() {

//   Check if already liked or not:

  console.log("Here");
  const heartIcon = document.getElementById("like-icon");
  heartIcon.classList.remove('fa-regular')
  heartIcon.classList.add('fa-solid')
  heartIcon.style.color = "red";

}
