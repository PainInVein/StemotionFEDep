import { Card } from "antd";
import { Link } from "react-router-dom";

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CourseCard({
  title,
  image,
  provider = "STEM Academy",
  type = "Professional Certificate",
  rating = 4.7,
  tag,
}) {
  const to = `/courses/${slugify(title)}`;

  return (
    <Link to={to} className="block">
      <Card
        className="group overflow-hidden rounded-xl border border-gray-200
                   hover:shadow-lg transition-all h-full"
        styles={{ body: { padding: 0 } }}
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300
                       group-hover:scale-105"
          />

          {/* Tag (POPULAR / NEW / etc.) */}
          {tag && (
            <div className="absolute bottom-2 left-2 px-3 py-1 text-xs font-semibold
                            rounded-md bg-gradient-to-r from-orange-500 to-pink-500
                            text-white">
              {tag}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {/* Provider */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{provider}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2">
            {title}
          </h3>

          {/* Type */}
          <p className="text-sm text-gray-600">{type}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <span className="font-medium">{rating}</span>
            <span className="text-yellow-500">★</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
