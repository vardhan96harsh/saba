
const HeaderHP = ({ }) => {
    return (
        <header
        // bg-[#0296D6]  className={`w-full ${backgroundImage} flex min-h-[380px] items-center bg-center py-10`}
        >
            <section className="flex justify-between items-center bg-[#0296D6] px-6 py-4  my-6">
                <div className="flex justify-center items-center gap-5">
                    <img
                        src="./images/logo_white.svg"
                        className="w-16 h-16"
                        alt="HP Logo"
                    />
                    <div className="flex flex-col justify-center items-start">
                        {/* <span className="font-semibold text-xs text-white leading-5">
      Description about channel.
    </span> */}
                        {/* <span className="font-semibold text-xs text-white leading-5">
      192 videos | 88 Recordings
    </span> */}
                        {/* <span className="font-semiboldworkspaceda text-xs text-white leading-5">
      1.5M Members
    </span> */}
                    </div>
                </div>
                {/* <button
  type="button"
  className="bg-white text-[#0296D6] font-semibold text-sm rounded-sm py-3 px-8"
>
  Subscribe
</button> */}
            </section>

        </header>
    );
};

export default HeaderHP;