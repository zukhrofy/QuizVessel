import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Feature = () => {
  const featureList = [
    {
      title: "Quiz Reporting",
      description:
        "laporan komprehensif mengenai kinerja peserta, Mengidentifikasi kekuatan dan kelemahan untuk menyesuaikan quiz",
      icon: faFileLines,
    },
    {
      title: "Regular Timer Quiz",
      description:
        "pilihan quiz untuk membantu pengguna mengembangkan kemampuan mengelola waktu dan keputusan peserta secara efektif",
      icon: faFileLines,
    },
    {
      title: "Section Time Quiz",
      description:
        "pilihan quiz dalam beberapa bagian dengan pembagian waktunya sendiri, memudahkan pengguna berkonsentrasi pada topik tertentu",
      icon: faFileLines,
    },
  ];

  return (
    <section>
      <div className="container mx-auto grid gap-y-10 px-4 py-8 sm:py-16 lg:grid-cols-3">
        {/* left */}
        <div className="px-3">
          <p className="mb-6 font-bold uppercase text-blue-500">Features</p>
          <h2 className="mb-6 text-3xl font-bold">
            Why is it so <u className="text-blue-500">great?</u>
          </h2>
          <p className="text-neutral-500">
            aplikasi kuis kami menawarkan berbagai fitur yang inovatif untuk
            meningkatkan pengalaman belajar Anda. Dengan model quiz yang baru,
            Ayo mulai kuis sekarang!
          </p>
        </div>
        {/* right */}
        <div className="grid gap-y-8 lg:col-span-2 lg:grid-cols-2 lg:gap-y-12">
          {featureList.map((feature) => (
            <FeatureList
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureList = ({ title, description, icon }) => {
  return (
    <div className="flex gap-4 px-3">
      <div className="shrink-0">
        <div className="inline-block rounded-md bg-blue-100 p-4 text-blue-500">
          <FontAwesomeIcon className="h-5 w-6" icon={icon} />
        </div>
      </div>
      <div className="grow">
        <p className="mb-3 font-bold">{title}</p>
        <p className="text-neutral-500">{description}</p>
      </div>
    </div>
  );
};
export default Feature;
