import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import "./form.css";

// Initialize Supabase
const supabase = createClient(
  'https://epklyikbubnqckckyhjk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwa2x5aWtidWJucWNrY2t5aGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA4NzIsImV4cCI6MjA1NTc4Njg3Mn0.IhX7e7yzMYKPB12MP9nd4Sqfm7i8h4AO3anfqQGaocs'
);

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    travelPreference: "Flight",
  });
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Edited profile state used for live preview during edit mode
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const travelPreferences = ["Flight", "Train", "Bus", "Road Trip"];

  // Check for authentication and fetch session 
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        console.log("Current session:", currentSession);
        setSession(currentSession);
        
        if (!currentSession) {
          console.log("No session found, redirecting to login");
          navigate('/login');
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        showAlertMessage("Error fetching session", "error");
      }
    };

    fetchSession();

    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile data when session is available
  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  // Sync the edited profile whenever the saved profile changes
  useEffect(() => {
    setEditedProfile({ ...profile });
  }, [profile]);

  const fetchProfile = async () => {
    try {
      if (!session?.user) {
        console.log("No user in session");
        return;
      }

      console.log("Fetching profile for:", session.user.email);

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Profile data:", data);

      if (data) {
        setProfile(data);
      } else {
        console.log("No profile found, creating new one");
        
        const newProfile = {
          email: session.user.email,
          name: session.user.user_metadata?.name || "",
          phone: "",
          age: "",
          travelPreference: "Flight"
        };
        
        console.log("Attempting to insert:", newProfile);
        
        const { data: insertData, error: insertError } = await supabase
          .from('profile')
          .insert([newProfile])
          .select();

        if (insertError) {
          console.error("Error inserting profile:", insertError);
          throw insertError;
        }

        console.log("Insert successful:", insertData);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Profile error:", error);
      showAlertMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Handling change:", name, value);
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const validateProfile = () => {
    if (!editedProfile.name.trim()) {
      showAlertMessage("Name is required", "error");
      return false;
    }
    if (!editedProfile.phone.trim()) {
      showAlertMessage("Phone number is required", "error");
      return false;
    }
    return true;
  };

  const showAlertMessage = (message, type = 'success') => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => setShowAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSave = async () => {
    if (!validateProfile()) return;

    try {
      console.log("Attempting to update profile:", editedProfile);
      
      const { data, error } = await supabase
        .from('profile')
        .update({
          name: editedProfile.name,
          phone: editedProfile.phone,
          age: editedProfile.age,
          travelPreference: editedProfile.travelPreference
        })
        .eq('email', session.user.email)
        .select();

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      console.log("Update successful:", data);
      setProfile({ ...editedProfile });
      setIsEditing(false);
      showAlertMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      showAlertMessage(error.message, "error");
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Sign out successful");
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      showAlertMessage(error.message, "error");
    }
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      {showAlert.show && (
        <div className={`alert ${showAlert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {showAlert.message}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-content">
          <div className="profile-left">
            <h2 className="profile-name">
              {isEditing ? editedProfile.name : profile.name}
            </h2>
            <div className="profile-email">
              {session?.user?.email}
            </div>
            {isEditing && <small className="preview-label">Live Preview</small>}
          </div>

          <div className="profile-right">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="i"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled={true}
                  className="i"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="i"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={editedProfile.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="i"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Travel Style</label>
                <select
                  name="travelPreference"
                  value={editedProfile.travelPreference}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="i"
                >
                  {travelPreferences.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="button-group">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="button button-primary"
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="button button-success">
                    💾 Save Changes
                  </button>
                  <button onClick={handleCancel} className="button button-secondary">
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;