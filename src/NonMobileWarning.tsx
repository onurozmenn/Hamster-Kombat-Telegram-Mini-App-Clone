const NonMobileWarning = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Mobile Device Required</h1>
        <p className="text-lg mb-6">
          This application is only available on mobile devices. Please access it from your mobile phone.
        </p>
        <img 
          src="https://via.placeholder.com/150" 
          alt="Mobile Only" 
          className="mx-auto mb-6"
        />
        <p className="text-sm text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};


export default NonMobileWarning;
