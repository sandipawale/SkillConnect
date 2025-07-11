import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="w-full bg-gray-100 py-4">
      <div className="container mx-auto text-center text-gray-600">
        <p>© {new Date().getFullYear()} SkillConnect. Created by Sandip Awale. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default PublicFooter;