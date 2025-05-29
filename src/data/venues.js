import culturalCenterImage from '../assets/cultural_center.webp';
import nabHallImage from '../assets/nab_hall.webp';
import grandStandImage from '../assets/grand_stand.webp';
import diamondFieldImage from '../assets/diamond_field.webp';
import jubileeParkImage from '../assets/jubilee_park.webp';
import comGymImage from '../assets/com_gym.webp';
import researchBldgImage from '../assets/research_bldg.webp';
import binhiThirdImage from '../assets/binhi_third.webp';
import cteImage from '../assets/cte.png';
import foreignLanguagesImage from '../assets/foreign_languages.webp';

const venues = [
  {
    name: "Grand Cultural Center",
    description:
      "The crown jewel for grand performances and significant university events, the Grand Cultural Center boasts a large auditorium with extensive seating. It's the premier venue for cultural shows, major academic ceremonies like graduations and convocations, and high-profile keynote speeches. Equipped with professional sound and lighting systems for an unforgettable experience.",
    participants: 400,
    image: culturalCenterImage,
  },

  {
    name: "NAB Hall Function",
    description:
      "A versatile multi-purpose hall within the New Academic Building, the NAB Hall Function offers a spacious and adaptable setting for a wide array of university events. Perfect for large lectures, departmental assemblies, student orientations, and mid-sized conferences. Features flexible seating arrangements to suit your event's needs.",
    participants: 500,
    image: nabHallImage,
  },
  {
    name: "Grand Stand",
    description:
      "Overlooking our expansive outdoor fields, the Grand Stand provides ample tiered seating for spectators. This iconic venue is perfect for athletic events, university-wide parades, outdoor ceremonies, and large student gatherings where a vast audience is expected. Experience the energy of campus life from this central viewing point.",
    participants: 500,
    image: grandStandImage,
  },
  // New venues below
  {
    name: "Diamond Field",
    description:
      "A well-maintained open field, often utilized for baseball and softball, but versatile enough for various outdoor sports and recreational activities. The Diamond Field is a key resource for physical education classes, intramural sports, and outdoor student organizations looking for a dynamic open space.",
    participants: 500,
    image: diamondFieldImage,
  },
  {
    name: "Jubilee Park",
    description:
      "A serene and beautifully landscaped green space, Jubilee Park offers a peaceful retreat amidst the bustling campus. It's an ideal spot for informal gatherings, outdoor study groups, or simply enjoying a quiet moment. Perfect for small outdoor events, picnics, or as a scenic backdrop for casual meet-ups.",
    participants: 500,
    image: jubileeParkImage,
  },
  {
    name: "COM Gym",
    description:
      "The dedicated gymnasium of the College of Medicine, the COM Gym is a modern indoor facility suitable for various sports, fitness activities, and health-related events. It's an excellent venue for inter-college sports competitions, wellness programs, and practical demonstrations for health sciences students.",
    participants: 500,
    image: comGymImage,
  },

  {
    name: "Research Hall Function",
    description:
      "Situated within the university's research building, the Research Hall Function room is specifically designed to facilitate academic inquiry and dissemination. It's the go-to venue for research presentations, scientific seminars, data workshops, and collaborative meetings among researchers. Equipped to support advanced technical presentations.",
    participants: 500,
    image: researchBldgImage,
  },
  {
    name: "BINHI 3rd Floor Room",
    description:
      "Located on the third floor of the BINHI building, this room offers a versatile space suitable for smaller classes, specialized workshops, or breakout sessions. It provides a quiet and focused environment for learning and collaboration, supporting the various academic and research initiatives housed within the BINHI facility.",
    participants: 500,
    image: binhiThirdImage,
  },
  {
    name: "BINHI Conference Room",
    description:
      "A modern and well-equipped conference room within the BINHI building, designed for productive meetings and focused discussions. Ideal for committee meetings, project planning sessions, small group collaborations, and video conferences. Features comfortable seating and essential presentation technology.",
  },

  {
    name: "Center of Teaching Excellence",
    description:
      "Dedicated to fostering educational innovation and professional growth, the CTE is a modern facility designed for workshops, seminars, and collaborative discussions. Ideal for faculty development programs, curriculum planning sessions, and intimate academic gatherings. Equipped with flexible learning spaces and presentation tools.",
    participants: 100,
    image: cteImage,
  },
  {
    name: "Center for Foreign Languages",
    description:
      "This specialized room, often utilized as a rehearsal space by the university, is home to the Center for Foreign Languages. It provides a focused environment ideal for language classes, cultural practice sessions, and rehearsals for performing arts groups. Equipped to support auditory learning and collaborative practice.",
    participants: 500,
    image: foreignLanguagesImage,
  },
  // Add more venues as needed
];

export default venues; 