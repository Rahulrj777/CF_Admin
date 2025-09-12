import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  Video,
  Users,
  Home,
  Film,
  Camera,
  Scissors,
  Sparkles,
  Tv,
  Theater,
  CameraIcon,
  Palette,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Images,
} from "lucide-react";
import { useState, useEffect } from "react";

// Login page (expects to call onLogin() on successful auth)
import HomePage from "./Pages/Home";

// Home
import HomeBanner from "./Pages/Home/HomeBanner";
import HomeExclusive from "./Pages/Home/HomeExclusive";
import VideoPage from "./Pages/Home/VideoGallery";
import MentorPage from "./Pages/Home/HomeMentors";
import HomeFilmography from "./Pages/Home/HomeFilmography";

// direction-course
import DirectionBanner from "./Pages/Direction/DirectionBanner";
import DirectionHighlights from "./Pages/Direction/DirectionHighlights";
import DirectionDiploma from "./Pages/Direction/DirectionDiploma";
import DirectionMentor from "./Pages/Direction/DirectionMentor";
import DirectionFilmography from "./Pages/Direction/DirectionFilmography";

// cinematography-course
import CinematographyBanner from "./Pages/Cinematography/CinematographyBanner";
import CinematographyHighlights from "./Pages/Cinematography/CinematographyHighlights";
import CinematographyDiploma from "./Pages/Cinematography/CinematographyDiploma";
import CinematographyMentor from "./Pages/Cinematography/CinematographyMentor";
import CinematographyFilmography from "./Pages/Cinematography/CinematographyFilmography";

// editing-course
import EditingBanner from "./Pages/Editing/EditingBanner";
import EditingHighlights from "./Pages/Editing/EditingHighlights";
import EditingDiploma from "./Pages/Editing/EditingDiploma";
import EditingMentor from "./Pages/Editing/EditingMentor";
import EditingFilmography from "./Pages/Editing/EditingFilmography";

// vfx-course
import VfxBanner from "./Pages/vfx/vfxBanner";
import VfxHighlights from "./Pages/vfx/vfxHighlights";
import VfxDiploma from "./Pages/vfx/vfxDiploma";
import VfxMentor from "./Pages/vfx/vfxMentor";
import VfxFilmography from "./Pages/vfx/vfxFilmography";

// virtual-production-course
import VirtualProductionBanner from "./Pages/VirtualProduction/VirtualProductionBanner";
import VirtualProductionMentor from "./Pages/VirtualProduction/VirtualProductionMentor";
import VirtualProductionFilmography from "./Pages/VirtualProduction/VirtualProductionFilmography";
import VirtualProductionDiploma from "./Pages/VirtualProduction/VirtualProductionDiploma";

// di-course
import DiBanner from "./Pages/Di/DiBanner";
import DiHighlights from "./Pages/Di/DiHighlights";
import DiMentor from "./Pages/Di/DiMentor";
import DiFilmography from "./Pages/Di/DiFilmography";
import DiDiploma from "./Pages/Di/DiDiploma";

// photography-course
import PhotographyBanner from "./Pages/Photography/PhotographyBanner";
import Photographymentor from "./Pages/Photography/PhotographyMentor";
import PhotographyFilmography from "./Pages/Photography/PhotographyFilmography";
import PhotographyDiploma from "./Pages/Photography/PhotographyDiploma";

// acting-course
import ActingBanner from "./Pages/Acting/ActingBanner";
import ActingMentor from "./Pages/Acting/ActingMentor";
import ActingDiploma from "./Pages/Acting/ActingDiploma";

// CFA
import CfaBanner from "./Pages/Cfa/CfaBanner";
import CfaDiploma from "./Pages/Cfa/CfaDiploma";
import CfaMentor from "./Pages/Cfa/CfaMentor";
import CfaFilmography from "./Pages/Cfa/CfaFilmography";

// StageUnreal
import StageUnrealBanner from "./Pages/StageUnreal/StageUnrealBanner";
import StageUnrealDiploma from "./Pages/StageUnreal/StageUnrealDiploma.jsx";
import StageUnrealMentor from "./Pages/StageUnreal/StageUnrealMentor.jsx";
import StageUnrealFilmography from "./Pages/StageUnreal/StageUnrealFilmography.jsx";

//Video Gallery
import NewLaunches from "./Pages/VideoGallery/NewLaunches";
import Highlights from "./Pages/VideoGallery/Highlights";
import Review from "./Pages/VideoGallery/Review";
import GuestLecture from "./Pages/VideoGallery/GuestLecture.jsx";
import StudentWorks from "./Pages/VideoGallery/StudentWorks";

// Full menu from app-SPL3L
const menu = [
  {
    title: "Home Page",
    path: "/home",
    icon: <Home size={18} />,
    children: [
      { title: "Banner", path: "/home/banner", icon: "🏠" },
      { title: "CF Exclusive", path: "/home/exclusive", icon: "🎞️" },
      { title: "Mentor", path: "/home/mentor", icon: <Users size={16} /> },
      { title: "Mentor's Filmography", path: "/home/filmography", icon: "🎬" },
      {
        title: "Video Upload",
        path: "/home/video-upload",
        icon: <Video size={16} />,
      },
    ],
  },
  {
    title: "Video Gallery",
    path: "/gallery",
    icon: <Images size={18} />, // or <LayoutGrid size={18} /> or <Clapperboard size={18} />
    children: [
      { title: "Guest Lecture", path: "/gallery/guestlecture", icon: "🏠" },
      { title: "Highlights", path: "/gallery/highlights", icon: "🎞️" },
      {
        title: "New Launches",
        path: "/gallery/newlaunches",
        icon: <Users size={16} />,
      },
      { title: "Student Review", path: "/gallery/review", icon: "🎬" },
      {
        title: "Student Works",
        path: "/gallery/studentworks",
        icon: <Video size={16} />,
      },
    ],
  },
  {
    title: "Direction Course",
    path: "/direction-course",
    icon: <Film size={18} />,
    children: [
      { title: "Banner", path: "/direction-course/banner", icon: "🏳️" },
      {
        title: "Course Highlights",
        path: "/direction-course/highlights",
        icon: "✨",
      },
      {
        title: "1 Year Diploma",
        path: "/direction-course/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/direction-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/direction-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Cinematography",
    path: "/cinematography-course",
    icon: <Camera size={18} />,
    children: [
      { title: "Banner", path: "/cinematography-course/banner", icon: "🏳️" },
      {
        title: "Course Highlights",
        path: "/cinematography-course/highlights",
        icon: "✨",
      },
      {
        title: "1 Year Diploma",
        path: "/cinematography-course/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/cinematography-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/cinematography-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Editing Course",
    path: "/editing-course",
    icon: <Scissors size={18} />,
    children: [
      { title: "Banner", path: "/editing-course/banner", icon: "🏳️" },
      {
        title: "Course Highlights",
        path: "/editing-course/highlights",
        icon: "✨",
      },
      { title: "1 Year Diploma", path: "/editing-course/diploma", icon: "📜" },
      {
        title: "FilmMaker As Mentor",
        path: "/editing-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/editing-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Visual Effects Course",
    path: "/vfx-course",
    icon: <Sparkles size={18} />,
    children: [
      { title: "Banner", path: "/vfx-course/banner", icon: "🏳️" },
      {
        title: "Course Highlights",
        path: "/vfx-course/highlights",
        icon: "✨",
      },
      { title: "1 Year Diploma", path: "/vfx-course/diploma", icon: "📜" },
      {
        title: "FilmMaker As Mentor",
        path: "/vfx-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/vfx-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Virtual Production",
    path: "/virtual-production-course",
    icon: <Tv size={18} />,
    children: [
      {
        title: "Banner",
        path: "/virtual-production-course/banner",
        icon: "🏳️",
      },
      {
        title: "1 Year Diploma",
        path: "/virtual-production-course/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/virtual-production-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/virtual-production-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Stage Unreal",
    path: "/stage-unreal",
    icon: <Tv size={18} />,
    children: [
      {
        title: "Banner",
        path: "/stage-unreal/banner",
        icon: "🏳️",
      },
      {
        title: "1 Year Diploma",
        path: "/stage-unreal/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/stage-unreal/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/stage-unreal/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "CFA",
    path: "/cfa",
    icon: <Tv size={18} />,
    children: [
      {
        title: "Banner",
        path: "/cfa/banner",
        icon: "🏳️",
      },
      {
        title: "1 Year Diploma",
        path: "/cfa/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/cfa/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/cfa/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "Acting Course",
    path: "/acting-course",
    icon: <Theater size={18} />,
    children: [
      { title: "Banner", path: "/acting-course/banner", icon: "🏳️" },
      { title: "1 Year Diploma", path: "/acting-course/diploma", icon: "📜" },
      {
        title: "FilmMaker As Mentor",
        path: "/acting-course/filmmaker",
        icon: "🎥",
      },
    ],
  },
  {
    title: "Photography Course",
    path: "/photography-course",
    icon: <CameraIcon size={18} />,
    children: [
      { title: "Banner", path: "/photography-course/banner", icon: "🏳️" },
      {
        title: "1 Year Diploma",
        path: "/photography-course/diploma",
        icon: "📜",
      },
      {
        title: "FilmMaker As Mentor",
        path: "/photography-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/photography-course/filmography",
        icon: "🎬",
      },
    ],
  },
  {
    title: "DI Course",
    path: "/di-course",
    icon: <Palette size={18} />,
    children: [
      { title: "Banner", path: "/di-course/banner", icon: "🏳️" },
      { title: "Course Highlights", path: "/di-course/highlights", icon: "✨" },
      { title: "1 Year Diploma", path: "/di-course/diploma", icon: "📜" },
      {
        title: "FilmMaker As Mentor",
        path: "/di-course/filmmaker",
        icon: "🎥",
      },
      {
        title: "Mentor's Filmography",
        path: "/di-course/filmography",
        icon: "🎬",
      },
    ],
  },
];

function App() {
  const [openMenus, setOpenMenus] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarState");
    if (saved) setOpenMenus(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(openMenus));
  }, [openMenus]);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleRouteClick = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <HomePage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 h-screen bg-white shadow-md overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        >
          <div className="flex items-center justify-between p-4 text-xl font-bold border-b">
            <span>Admin Panel</span>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            {menu.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleMenu(section.title)}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="flex items-center gap-2">
                    {section.icon} {section.title}
                  </span>
                  {openMenus[section.title] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {openMenus[section.title] && (
                  <div className="ml-6 flex flex-col gap-1">
                    {section.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={handleRouteClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2 p-2 rounded-lg transition ${
                            isActive
                              ? "bg-blue-100 text-blue-600 font-medium"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        {child.icon} {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-0 overflow-y-auto h-screen">
          <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between z-50 lg:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <div className="p-6 pt-18 lg:pt-5">
            <div className="hidden lg:flex justify-end mb-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            <Routes>
              <Route path="/" element={<HomeBanner />} />

              {/* Home */}
              <Route path="/home/banner" element={<HomeBanner />} />
              <Route path="/home/exclusive" element={<HomeExclusive />} />
              <Route path="/home/video-upload" element={<VideoPage />} />
              <Route path="/home/mentor" element={<MentorPage />} />
              <Route path="/home/filmography" element={<HomeFilmography />} />

              {/* Video Gallery */}
              <Route path="/gallery/guestlecture" element={<GuestLecture />} />
              <Route path="/gallery/highlights" element={<Highlights />} />
              <Route path="/gallery/newlaunches" element={<NewLaunches />} />
              <Route path="/gallery/review" element={<Review />} />
              <Route path="/gallery/studentworks" element={<StudentWorks />} />

              {/* Direction */}
              <Route
                path="/direction-course/banner"
                element={<DirectionBanner />}
              />
              <Route
                path="/direction-course/highlights"
                element={<DirectionHighlights />}
              />
              <Route
                path="/direction-course/diploma"
                element={<DirectionDiploma />}
              />
              <Route
                path="/direction-course/filmmaker"
                element={<DirectionMentor />}
              />
              <Route
                path="/direction-course/filmography"
                element={<DirectionFilmography />}
              />

              {/* DI */}
              <Route path="/di-course/banner" element={<DiBanner />} />
              <Route path="/di-course/highlights" element={<DiHighlights />} />
              <Route path="/di-course/filmmaker" element={<DiMentor />} />
              <Route
                path="/di-course/filmography"
                element={<DiFilmography />}
              />
              <Route path="/di-course/diploma" element={<DiDiploma />} />

              {/* Editing */}
              <Route
                path="/editing-course/banner"
                element={<EditingBanner />}
              />
              <Route
                path="/editing-course/highlights"
                element={<EditingHighlights />}
              />
              <Route
                path="/editing-course/diploma"
                element={<EditingDiploma />}
              />
              <Route
                path="/editing-course/filmmaker"
                element={<EditingMentor />}
              />
              <Route
                path="/editing-course/filmography"
                element={<EditingFilmography />}
              />

              {/* Photography */}
              <Route
                path="/photography-course/banner"
                element={<PhotographyBanner />}
              />
              <Route
                path="/photography-course/filmmaker"
                element={<Photographymentor />}
              />
              <Route
                path="/photography-course/filmography"
                element={<PhotographyFilmography />}
              />
              <Route
                path="/photography-course/diploma"
                element={<PhotographyDiploma />}
              />

              {/* VFX */}
              <Route path="/vfx-course/banner" element={<VfxBanner />} />
              <Route
                path="/vfx-course/highlights"
                element={<VfxHighlights />}
              />
              <Route path="/vfx-course/diploma" element={<VfxDiploma />} />
              <Route path="/vfx-course/filmmaker" element={<VfxMentor />} />
              <Route
                path="/vfx-course/filmography"
                element={<VfxFilmography />}
              />

              {/* StageUnreal */}
              <Route
                path="/stage-unreal/banner"
                element={<StageUnrealBanner />}
              />
              <Route
                path="/stage-unreal/diploma"
                element={<StageUnrealDiploma />}
              />
              <Route
                path="/stage-unreal/filmmaker"
                element={<StageUnrealMentor />}
              />
              <Route
                path="/stage-unreal/filmography"
                element={<StageUnrealFilmography />}
              />

              {/* Virtual Production */}
              <Route
                path="/virtual-production-course/banner"
                element={<VirtualProductionBanner />}
              />
              <Route
                path="/virtual-production-course/filmmaker"
                element={<VirtualProductionMentor />}
              />
              <Route
                path="/virtual-production-course/filmography"
                element={<VirtualProductionFilmography />}
              />
              <Route
                path="/virtual-production-course/diploma"
                element={<VirtualProductionDiploma />}
              />

              {/* Cinematography */}
              <Route
                path="/cinematography-course/banner"
                element={<CinematographyBanner />}
              />
              <Route
                path="/cinematography-course/highlights"
                element={<CinematographyHighlights />}
              />
              <Route
                path="/cinematography-course/diploma"
                element={<CinematographyDiploma />}
              />
              <Route
                path="/cinematography-course/filmmaker"
                element={<CinematographyMentor />}
              />
              <Route
                path="/cinematography-course/filmography"
                element={<CinematographyFilmography />}
              />

              {/* Acting */}
              <Route path="/acting-course/banner" element={<ActingBanner />} />
              <Route
                path="/acting-course/filmmaker"
                element={<ActingMentor />}
              />
              <Route
                path="/acting-course/diploma"
                element={<ActingDiploma />}
              />

              {/* CFA */}
              <Route path="/cfa/banner" element={<CfaBanner />} />
              <Route path="/cfa/diploma" element={<CfaDiploma />} />
              <Route path="/cfa/filmmaker" element={<CfaMentor />} />
              <Route path="/cfa/filmography" element={<CfaFilmography />} />

              {/* Optionally keep dynamic placeholder routes, or remove if not needed */}
              {menu.flatMap((section) =>
                section.children.map((child) => (
                  <Route
                    key={child.path}
                    path={child.path + "/placeholder"}
                    element={
                      <div className="p-6 text-lg font-semibold">
                        {child.title} Page
                      </div>
                    }
                  />
                ))
              )}
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
