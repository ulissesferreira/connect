const users = [
    {
        bio: "Product person with a lot to learn.  I'm not going to pretend I have answers but I'm happy to guide you and connect you with people who can help you.",
        company: "Upframe",
        keycode: "malik",
        name: "Malik Piara",
        pictures: {},
        profilePic: "https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg",
        role: "Product Owner",
        slots: [],
        tags: "",
        uid: "3a611becd332813182559cf781f32ae18caa09c1",
    },
    {
        bio: "test.",
        company: "Upframe",
        keycode: "yoav",
        name: "yoav Piara",
        pictures: {},
        profilePic: "https://connect-api-profile-pictures.s3.eu-west-2.amazonaws.com/3a611becd332813182559cf781f32ae18caa09c1.jpg",
        role: "Product Owner",
        slots: [],
        tags: "",
        uid: "3a611bead332813182559cf781f32ae18caa09c1",
    }

]


const fetchData = () => {
    return Promise.resolve({ mentors: users })
}