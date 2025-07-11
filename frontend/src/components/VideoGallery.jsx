import React from 'react';
import './VideoGallery.css';

const videoData = [
    {
        link: "https://www.youtube.com/watch?v=8FMncldP9dE",
        title: "EL CLASICO REACTION 👀 'Nobody would've thought Barcelona would win 4-0!' - Klinsmann",
        duration: "19:25",
        publisher: "ESPN FC"
    },
    {
        link: "https://www.youtube.com/watch?v=bzb7x7CZHhg",
        title: "Is the US election too close to call?",
        duration: "24:32",
        publisher: "BBC News"
    },
    {
        link: "https://www.youtube.com/watch?v=nzzAEYVdfQM",
        title: "WATCH LIVE: Biden awards National Medals of Arts to Steven Spielberg, Missy Elliott, among others",
        duration: "26:25",
        publisher: "PBS NewsHour"
    },
    {
        link: "https://www.youtube.com/watch?v=Ci2poZjwFM4",
        title: "Netanyahu Says Attack on Iran ‘Achieved All Its Goals’",
        duration: "3:21",
        publisher: "DawnNews"
    },
    {
        link: "https://www.youtube.com/watch?v=xvfhP630EjY",
        title: "Iran’s Khamenei says ‘wrong’ to downplay Israel’s attack",
        duration: "9:02",
        publisher: "Al Jazeera English"
    },
    {
        link: "https://www.youtube.com/watch?v=RtqBiA3sDH4",
        title: "Sid Lowe dissects what went wrong for Real Madrid in El Clasico",
        duration: "7:55",
        publisher: "ESPN FC"
    },
    {
        link: "https://www.youtube.com/watch?v=Ic7Aai6Uopg",
        title: "The Doorway to the Underworld is Growing and We Can't Stop It",
        duration: "7:53",
        publisher: "SciShow"
    },
    {
        link: "https://www.youtube.com/watch?v=o0A9M5wHBA4",
        title: "An Ancient Roman Shipwreck May Explain the Universe",
        duration: "31:14",
        publisher: "SciShow"
    },
    {
        link: "https://www.youtube.com/watch?v=Zv0myuOFIeY",
        title: "How Baboons Led Us to a Lost Civilization",
        duration: "12:04",
        publisher: "SciShow"
    }
];

// Function to shuffle an array and return a subset
const getRandomVideos = (videos, count) => {
    const shuffled = [...videos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const VideoGallery = () => {
    const selectedVideos = getRandomVideos(videoData, 4);
    const featuredVideo = selectedVideos[0];
    const otherVideos = selectedVideos.slice(1);

    return (
        <div className="video-gallery">
            <h2 className="video-gallery-title">Video Gallery</h2>
            <div className="video-gallery-content">
                {/* Featured Video */}
                <div className="featured-video">
                    <a href={featuredVideo.link} target="_blank" rel="noopener noreferrer">
                        <img
                            src={`https://img.youtube.com/vi/${featuredVideo.link.split("v=")[1]}/maxresdefault.jpg`}
                            alt={featuredVideo.title}
                            className="featured-thumbnail"
                        />
                        <div className="play-button">&#9658;</div>
                    </a>
                    <div className="featured-info">
                        <h3 className="featured-title">{featuredVideo.title}</h3>
                        <p className="featured-author">by {featuredVideo.publisher}</p>
                    </div>
                </div>

                {/* Other Videos */}
                <div className="other-videos">
                    {otherVideos.map((video, index) => (
                        <a key={index} href={video.link} target="_blank" rel="noopener noreferrer" className="video-item">
                            <img
                                src={`https://img.youtube.com/vi/${video.link.split("v=")[1]}/mqdefault.jpg`}
                                alt={video.title}
                                className="video-thumbnail"
                            />
                            <div className="video-info">
                                <span className="video-duration">⏱ {video.duration}</span>
                                <h4 className="video-title">{video.title}</h4>
                                <p className="video-author">by {video.publisher}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoGallery;
