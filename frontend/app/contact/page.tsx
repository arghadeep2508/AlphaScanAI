export default function Contact() {

  return (

    <main className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-6">

      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl p-10 shadow-lg">

        {/* Title */}

        <h1 className="text-3xl font-bold text-yellow-400 mb-3">
          Contact AlphaScanAI
        </h1>

        <p className="text-slate-400 mb-8 leading-relaxed">
          If you have questions, feature suggestions, bug reports, or legal concerns
          regarding AlphaScanAI, feel free to reach out. Your feedback helps improve
          the platform and make AI-driven stock analysis more accessible and reliable
          for everyone.
        </p>


        {/* Contact Info Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          {/* Project */}

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">

            <p className="text-xs text-slate-400 mb-1">
              PROJECT
            </p>

            <p className="text-white font-semibold">
              AlphaScanAI
            </p>

            <p className="text-sm text-slate-400 mt-1">
              AI Stock Analysis Dashboard
            </p>

          </div>


          {/* Email */}

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">

            <p className="text-xs text-slate-400 mb-1">
              SUPPORT EMAIL
            </p>

            <a
              href="mailto:adsupport333@gmail.com"
              className="text-yellow-400 font-medium hover:underline"
            >
              adsupport333@gmail.com
            </a>

          </div>


          {/* Purpose */}

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">

            <p className="text-xs text-slate-400 mb-1">
              PURPOSE
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              Questions, feedback, feature suggestions, bug reports,
              or general inquiries related to AlphaScanAI.
            </p>

          </div>

        </div>


        {/* Response Time */}

        <div className="mt-8 bg-slate-950 border border-slate-800 rounded-lg p-5 max-w-sm">

          <p className="text-xs text-slate-400 mb-1">
            RESPONSE TIME
          </p>

          <p className="text-white font-medium">
            Within 24 Hours
          </p>

        </div>


        {/* Optional note */}

        <p className="text-slate-500 text-sm mt-8 leading-relaxed">
          Please note that AlphaScanAI provides technical support related to
          the platform only. We do not provide financial or investment advice.
        </p>

      </div>

    </main>

  );
}