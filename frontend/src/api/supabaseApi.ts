// Supabase API functions for VSBC application
// 
// Image Upload Features:
// - Automatic image resizing to meet size limits
// - Profile pictures: max 200KB
// - Event pictures: max 200KB  
// - Media images: max 2MB
// - Resizing uses quality reduction and dimension scaling for optimal results
import { supabase } from '../utils/supabaseClient';
import {
  type HealthCheckResponse,
  type ImageUploadRequest,
  type ImageUploadResponse,
  type MemberStatusResponse,
  type ProfileUpdateRequest,
  type ProfileUpdateResponse,
  type Member,
  type MemberCreateRequest,
  type Event,
  type EventCreateRequest,
  type EventUpdateRequest,
  type AllowedEmail,
  type AllowedEmailCreateRequest,
} from './types';



// Health Check
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  return { status: 'ok' };
};

// Helper function to resize images to meet size requirements
export const resizeImageToFitSize = async (file: File, maxSizeBytes: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      // Start with original dimensions
      let { width, height } = img;
      let quality = 0.9;
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loops
      
      // Function to attempt resize with current settings
      const attemptResize = () => {
        attempts++;
        if (attempts > maxAttempts) {
          reject(new Error(`Failed to resize image after ${maxAttempts} attempts`));
          return;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with current quality
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          if (blob.size <= maxSizeBytes) {
            // Create new file with resized image
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            // Reduce quality or dimensions and try again
            if (quality > 0.3) {
              quality -= 0.1;
              attemptResize();
            } else if (width > 50 && height > 50) {
              // Reduce dimensions by 15% for more aggressive resizing
              width = Math.floor(width * 0.85);
              height = Math.floor(height * 0.85);
              quality = 0.9; // Reset quality
              attemptResize();
            } else {
              // If we can't get it small enough, reject
              reject(new Error(`Unable to resize image to fit ${(maxSizeBytes / 1024).toFixed(1)}KB limit. Minimum achievable size: ${(blob.size / 1024).toFixed(1)}KB`));
            }
          }
        }, file.type, quality);
      };
      
      attemptResize();
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Image Upload
export const uploadImage = async (request: ImageUploadRequest): Promise<ImageUploadResponse> => {
  try {
    const { file, bucket_type, file_id } = request;
    
    // Validate file type - only allow PNG, JPEG, and JPG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File must be a PNG, JPEG, or JPG image');
    }
    
    // Define size limits for each bucket type
    const sizeLimits = {
      profile: 200 * 1024,      // 200KB for profile pictures
      event: 200 * 1024,        // 200KB for event pictures
      media: 2 * 1024 * 1024    // 2MB for media images
    };
    
    const maxSizeBytes = sizeLimits[bucket_type];
    let processedFile = file;
    
    // Check if file needs resizing
    if (file.size > maxSizeBytes) {
      try {
        processedFile = await resizeImageToFitSize(file, maxSizeBytes);
      } catch (resizeError) {
        throw new Error(`Image too large (${(file.size / 1024).toFixed(1)}KB) and could not be resized to fit ${(maxSizeBytes / 1024).toFixed(1)}KB limit. Please choose a smaller image or resize it using an online tool.`);
      }
    }
    
    // Get bucket name based on type
    const bucketMap = {
      media: 'media',
      profile: 'profile-pics',
      event: 'event-images'
    };
    
    const bucketName = bucketMap[bucket_type];
    
    // Generate filename
    const fileExtension = file.name.split('.').pop();
    const prefix = file_id || crypto.randomUUID();
    const filename = `${bucket_type}/${prefix}.${fileExtension}`;
    
    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filename, processedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    // Generate public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    return {
      success: true,
      filename,
      url: urlData.publicUrl,
      bucket: bucketName
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Status Check
export const checkStatus = async (email: string): Promise<MemberStatusResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke("allowed_emails", {
      body: { action: "check", email }
    });

    if (error) {
      return { is_member: false, email: email, id: "", is_admin: false };
    }

    return {
      is_member: !!data.email,
      email: data.email,
      id: data.id || "",
      is_admin: data.is_admin || false
    };
  } catch (error) {
    return { is_member: false, email: email, id: "", is_admin: false };

  }
};

// Profile Update
export const updateProfile = async (request: ProfileUpdateRequest): Promise<ProfileUpdateResponse> => {
  try {
    const { email, name, linkedIn, title, image } = request;
    
    // Check if user exists in allowedemails table
    const memberStatus = await checkStatus(email);
    if (!memberStatus.is_member) {
      throw new Error('User email not found in allowed emails');
    }
    
    // Handle image upload if provided
    let imageUrl = '';
    if (image) {
      const uploadResult = await uploadImage({
        file: image,
        bucket_type: 'profile',
        file_id: email // Use email as the file_id since it's now the primary key
      });
      imageUrl = uploadResult.filename;
    }
    
    // Get or create member record
    let { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .single();
    
    if (memberError && memberError.code !== 'PGRST116') {
      throw new Error(`Failed to get member: ${memberError.message}`);
    }
    
    if (!member) {
      // Create new member
      const { data: newMember, error: createError } = await supabase
        .from('members')
        .insert({
          email,
          name,
          linkedin: linkedIn || '',
          title: title || '',
          board: false,
          image: imageUrl
        })
        .select()
        .single();
      
      if (createError) {
        throw new Error(`Failed to create member: ${createError.message}`);
      }
      
      member = newMember;
    } else {
      // Update existing member
      const { data: updatedMember, error: updateError } = await supabase
        .from('members')
        .update({
          name,
          linkedin: linkedIn || member.linkedin,
          title: title || member.title,
          image: imageUrl || member.image
        })
        .eq('id', member.id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`Failed to update member: ${updateError.message}`);
      }
      
      member = updatedMember;
    }
    
    return {
      success: true,
      member: {
        id: member.id,
        name: member.name,
        linkedIn: member.linkedin,
        title: member.title,
        board: member.board,
        image: member.image
      }
    };
  } catch (error) {
    throw new Error(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


// Member CRUD Operations
export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }
  
  return data.map(member => ({
    id: member.id || "",
    name: member.name,
    linkedIn: member.linkedin || null,
    title: member.title || null,
    board: member.board,
    image: member.image || null
  }));
};


export const getMember = async (email: string, id_val: string): Promise<Member> => {
  try {
    
    const memberStatus = await checkStatus(email);
    if (!memberStatus.is_member) {
      throw new Error('User email not found in allowed emails');
    }

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id_val)
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
      } else {
        throw new Error(`Failed to fetch member: ${error.message}`);
      }
    }

    if(!data || data.length === 0){
      // Try to create member if it doesn't exist
      try {
        const { data: createData, error: createError } = await supabase.functions.invoke("create_member", {
          body: { action: "create", email: email }
        });
        
        if (createError) {
        }
        
        // If creation was successful, use the created data
        if (createData) {
          return {
            id: createData.id,
            name: createData.name || null,
            linkedIn: createData.linkedin || null,
            title: createData.title || null,
            board: false,
            image: createData.image || null
          };
        }

      } catch (createError) {
      }
    }
    
    // Return the existing member data
    if (Array.isArray(data) && data.length > 0) {
      return {
        id: data[0].id,
        name: data[0].name,
        linkedIn: data[0].linkedin || null,
        title: data[0].title || null,
        board: data[0].board,
        image: data[0].image || null
      };
    } 
    else {
      return {
        id: "",
        name: 'Unknown',
        linkedIn: null,
        title: null,
        board: false,
        image: null
      };
    }
  } catch (error) {
    throw error;
  }
};

export const createMember = async (memberData: MemberCreateRequest): Promise<Member> => {
  const { data, error } = await supabase
    .from('members')
    .insert({
      name: memberData.name,
      linkedin: memberData.linkedIn || '',
      title: memberData.title || '',
      board: memberData.board || false,
      image: memberData.image || ''
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create member: ${error.message}`);
  }
  
  return {
    id: data.id,
    name: data.name,
    linkedIn: data.linkedin || null,
    title: data.title || null,
    board: data.board,
    image: data.image || null
  };
};

export const updateMember = async (memberData: Member): Promise<Member> => {
  const { data, error } = await supabase
    .from('members')
    .update({
      name: memberData.name,
      linkedin: memberData.linkedIn,
      title: memberData.title,
      board: memberData.board,
      image: memberData.image
    })
    .eq('id', memberData.id)
    .select()
    .limit(1);
  
  if (error) {
    throw new Error(`Failed to update member: ${error.message}`);
  }
  return {
    id: data[0]?.id || "",
    name: data[0]?.name || "",
    linkedIn: data[0]?.linkedin || null,
    title: data[0]?.title || null,
    board: data[0]?.board,
    image: data[0]?.image || null
  };
};

export const deleteMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete member: ${error.message}`);
  }
};

export const getBoardMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('board', true)
    .order('name');
  
  if (error) {
    throw new Error(`Failed to fetch board members: ${error.message}`);
  }
  
  return data.map(member => ({
    id: member.id,
    name: member.name,
    linkedIn: member.linkedin,
    title: member.title,
    board: member.board,
    image: member.image
  }));
};

export const getNonBoardMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('board', false)
    .order('name');
  
  if (error) {
    throw new Error(`Failed to fetch non-board members: ${error.message}`);
  }
  
  return data.map(member => ({
    id: member.id,
    name: member.name,
    linkedIn: member.linkedin,
    title: member.title,
    board: member.board,
    image: member.image
  }));
};

// Event CRUD Operations
export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
  
  return data.map(event => ({
    id: event.id || 0,
    title: event.title || null,
    description: event.description || null,
    date: event.date || null,
    location: event.location || null,
    event_type: event.event_type,
    image: event.image || null
  }));
};

export const getEvent = async (id: number): Promise<Event> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    location: data.location,
    event_type: data.event_type,
    image: data.image
  };
};

export const createEvent = async (eventData: EventCreateRequest): Promise<Event> => {
  const { data, error } = await supabase
    .from('event')
    .insert(eventData)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    location: data.location,
    event_type: data.event_type,
    image: data.image
  };
};

export const updateEvent = async (id: number, eventData: EventUpdateRequest): Promise<Event> => {
  const { data, error } = await supabase
    .from('event')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    location: data.location,
    event_type: data.event_type,
    image: data.image
  };
};

export const deleteEvent = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('event')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

export const getClubEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('event_type', 'club')
    .order('date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch club events: ${error.message}`);
  }
  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    event_type: event.event_type,
    image: event.image
  }));
};

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('event_type', 'featured')
    .order('date', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch featured events: ${error.message}`);
  }
  
  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    event_type: event.event_type,
    image: event.image
  }));
};

export const getRecruitingEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('event_type', 'recruiting')
    .order('date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch recruiting events: ${error.message}`);
  }
  
  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    event_type: event.event_type,
    image: event.image
  }));
};

// Allowed Email CRUD Operations
export const checkAllowedEmail = async (): Promise<{ email: string } | null> => {
  const { data, error } = await supabase.functions.invoke("allowed_emails", {
    body: { action: "check" }
  });

  if (error) {
    throw new Error(error.message || 'Failed to check allowed email');
  }

  return data.email ? { email: data.email } : null;
};

export const createAllowedEmail = async (emailData: AllowedEmailCreateRequest): Promise<AllowedEmail> => {
  const { data, error } = await supabase.functions.invoke("allowed_emails", {
    body: { action: "create", email: emailData.email }
  });

  if (error) {
    throw new Error(error.message || 'Failed to create allowed email');
  }

  return { email: data.email };
};

export const deleteAllowedEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.functions.invoke("allowed_emails", {
    body: { action: "delete", email }
  });

  if (error) {
    throw new Error(error.message || 'Failed to delete allowed email');
  }
};
