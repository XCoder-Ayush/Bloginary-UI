const token = localStorage.getItem('jwtToken');
let user=undefined

if (token) {
    const [, payloadBase64] = token.split('.');
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log('Decoded Payload:', decodedPayload);
    fetchUser(decodedPayload.username);

} else {
    console.error('JWT token not found in localStorage');
}

async function fetchUser(username){
  const url=`http://localhost:3001/api/v1/user/${username}`
  const resp = await fetch(url);
  user=await resp.json();

  console.log(user)

  // Change Image In Navbar
  document.querySelector('#dp').src=user.profilePictureURL
}

function formatMongoDate(createdAt) {
  // Convert MongoDB date string to Date object
  const date = new Date(createdAt);

  // Define month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

  // Get components of the date
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Construct the formatted date string
  const formattedDate = monthNames[monthIndex] + ' ' + day + ', ' + year;

  return formattedDate;
}

function createBlogElement(blogData) {
  // Create elements
  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blog");

  const imgWrapperDiv = document.createElement("div");
  imgWrapperDiv.classList.add("blog-img-wrapper");
  const img = document.createElement("img");
  img.src = blogData.imageSrc;
  img.alt = "";
  img.classList.add("blog-img");
  imgWrapperDiv.appendChild(img);

  const categoryWrapperDiv = document.createElement("div");
  categoryWrapperDiv.classList.add("category-wrapper");

  blogData.categories.forEach((category)=>{
    const categoryBtn = document.createElement("button");
    categoryBtn.classList.add("category-btn");
    categoryBtn.textContent = category.name;
    categoryWrapperDiv.appendChild(categoryBtn);
  })


  const blogTitleDiv = document.createElement("div");
  blogTitleDiv.classList.add("blog-title");
  const title = document.createElement("h3");
  title.textContent = blogData.title;
  blogTitleDiv.appendChild(title);

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

  blogDiv.appendChild(imgWrapperDiv);
  blogDiv.appendChild(categoryWrapperDiv);
  blogDiv.appendChild(blogTitleDiv);
  blogDiv.appendChild(blogMetaDiv);


  blogDiv.id=blogData.id

  blogDiv.addEventListener('click',()=>{
    window.location.href=`http://127.0.0.1:5500/views/blog.html?id=${blogData.id}`
  })
  return blogDiv;
}

async function fetchAllLatestPosts() {
  const resp = await fetch("http://localhost:3001/api/v1/blog");
  const blogs = await resp.json();
  console.log(blogs);

  await Promise.all(blogs.map(async (blog) => {

    let categories=[]
    await Promise.all(blog.categories.map(async (categoryId)=>{
      const resp = await fetch(`http://localhost:3001/api/v1/category/${categoryId}`);
      const category = await resp.json();
      categories.push(category)
    }))

    const blogData = {
      imageSrc: blog.imageURL,
      categories: categories,
      title:blog.title,
      profilePicSrc: blog.authorProfilePictureURL,
      author: blog.authorFirstName+" "+blog.authorLastName,
      date: formatMongoDate(blog.createdAt),
      id:blog._id
    };
    const blogDOMElement = createBlogElement(blogData);

    document.querySelector('.blogs-container').appendChild(blogDOMElement)
  }));
}

async function fetchAllTrendingPosts() {
  const resp = await fetch("http://localhost:3001/api/v1/blog");
  const blogs = await resp.json();
  console.log(blogs);
}

window.addEventListener("load", fetchAllLatestPosts);
window.addEventListener("load", fetchAllTrendingPosts);

