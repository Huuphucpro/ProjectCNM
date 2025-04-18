import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./UpdateProfile.module.scss";
import "../../../../scss/dialog.scss";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/reducers";
import { getUserByIdRequest, updateAvatarRequest, updateUserRequest } from "../../../../redux/actions/UserAction";

interface Update {
    open: boolean,
    handleClose: () => void
}

interface FormValues {
    image: FileList;
    name: string;
    phone: string;
}

const UpdateProfile = ({ open, handleClose }: Update) => {
    const dispatch = useDispatch();
    const { userCurrent }: any = useSelector<RootState>((state) => state.user);
    const { socket }: any = useSelector<RootState>((state) => state);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSource, setPreviewSource] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");
    const [newPhone, setNewPhone] = useState<string>("");
    const [freshUserData, setFreshUserData] = useState<any>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    // Fetch fresh user data when dialog opens
    useEffect(() => {
        if (open && userCurrent?._id) {
            dispatch(getUserByIdRequest(userCurrent._id));
        }
    }, [open, userCurrent?._id, dispatch]);

    // Update local state when userCurrent changes
    useEffect(() => {
        if (userCurrent) {
            setNewName(userCurrent.name || "");
            setNewPhone(userCurrent.phone || "");
            setFreshUserData(userCurrent);
        }
    }, [userCurrent]);

    // Listen for user_updated events
    useEffect(() => {
        if (socket) {
            console.log("Setting up user_updated listener");
            socket.on("user_updated", (data: any) => {
                console.log("User updated event received:", data);
                if (data.userId === userCurrent?._id) {
                    // Update local state
                    setNewName(data.name || "");
                    setNewPhone(data.phone || "");
                    setFreshUserData({
                        ...freshUserData,
                        name: data.name,
                        phone: data.phone
                    });
                    
                    // Refresh user data
                    dispatch(getUserByIdRequest(userCurrent._id));
                }
            });
            
            return () => {
                console.log("Cleaning up user_updated listener");
                socket.off("user_updated");
            };
        }
    }, [socket, userCurrent?._id, dispatch]);

    const onSubmit: SubmitHandler<FormValues> = async () => {
        try {
            setError("");
            let hasChanges = false;
            const formData = new FormData();

            // Add user ID to formData
            formData.append("_id", userCurrent._id);

            // Add avatar if selected
            if (selectedFile) {
                formData.append("image", selectedFile);
                hasChanges = true;
            }

            // Add name if changed
            if (newName && newName !== freshUserData?.name) {
                formData.append("name", newName);
                hasChanges = true;
            }

            // Add phone if changed
            if (newPhone && newPhone !== freshUserData?.phone) {
                formData.append("phone", newPhone);
                hasChanges = true;
            }

            // Only dispatch if there are changes
            if (hasChanges) {
                console.log("Updating user with data:", {
                    id: userCurrent._id,
                    name: newName,
                    phone: newPhone,
                    hasAvatar: !!selectedFile
                });

                // Update user information
                if (selectedFile) {
                    // If there's an avatar to update, use updateAvatarRequest
                    await dispatch(updateAvatarRequest(formData));
                } else {
                    // If only updating name/phone, use updateUserRequest
                    await dispatch(updateUserRequest({
                        id: userCurrent._id,
                        data: formData
                    }));
                }

                // Refresh user data after successful update
                setTimeout(() => {
                    dispatch(getUserByIdRequest(userCurrent._id));
                }, 1000);
            }
            
            handleClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again.");
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError("");
        const files = e.target.files;
        
        if (!files || files.length === 0) {
            setPreviewSource("");
            setSelectedFile(null);
            return;
        }
        
        const file = files[0];
        
        // Log file information for debugging
        console.log("Selected file:", {
            name: file.name,
            type: file.type,
            size: file.size,
            extension: file.name.split('.').pop()?.toLowerCase()
        });
        
        // Check file extension (match backend allowed extensions)
        const fileName = file.name.toLowerCase();
        const validExtensions = ['.jpg', '.jpeg', '.png'];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type) || !hasValidExtension) {
            setError("Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, JPEG hoặc PNG)");
            setPreviewSource("");
            setSelectedFile(null);
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Kích thước hình ảnh phải nhỏ hơn 5MB");
            setPreviewSource("");
            setSelectedFile(null);
            return;
        }
        
        setSelectedFile(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result as string);
        };
    };

    const handleNameEdit = () => {
        // Fetch fresh data before editing
        dispatch(getUserByIdRequest(userCurrent._id));
        setIsEditingName(true);
    };

    const handlePhoneEdit = () => {
        // Fetch fresh data before editing
        dispatch(getUserByIdRequest(userCurrent._id));
        setIsEditingPhone(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPhone(e.target.value);
    };

    const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditingName(false);
            if (newName && newName !== freshUserData.name) {
                const formData = new FormData();
                formData.append("name", newName);
                console.log("Submitting name update:", newName);
                dispatch(updateUserRequest({
                    id: userCurrent._id,
                    data: formData
                }));
                setTimeout(() => {
                    dispatch(getUserByIdRequest(userCurrent._id));
                }, 1000);
            }
        }
    };

    const handlePhoneSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditingPhone(false);
            if (newPhone && newPhone !== freshUserData.phone) {
                const formData = new FormData();
                formData.append("phone", newPhone);
                console.log("Submitting phone update:", newPhone);
                dispatch(updateUserRequest({
                    id: userCurrent._id,
                    data: formData
                }));
                setTimeout(() => {
                    dispatch(getUserByIdRequest(userCurrent._id));
                }, 1000);
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <form className={styles.dialog} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.title}>
                        <span>Cập nhật thông tin</span>
                        <div className={styles.close} onClick={() => handleClose()}></div>
                    </div>
                    <div className={styles.img}>
                        <img src="https://res.cloudinary.com/ds4v3awds/image/upload/v1733805276/samples/coffee.jpg" alt="Cover"></img>
                    </div>
                    <div className={styles.avatar}>
                        <div className={styles.img}>
                            {previewSource ? (
                                <img src={previewSource} alt="Selected preview" />
                            ) : (
                                <div>
                                    {freshUserData?.avatar ? (
                                        <img src={freshUserData.avatar} alt="User avatar"></img>
                                    ) : (
                                        <img 
                                            src="https://res.cloudinary.com/ds4v3awds/image/upload/v1743854129/rrotvnyfpdkih3goymsa.jpg" 
                                            alt="Default avatar"
                                        ></img>
                                    )}
                                </div>
                            )}

                            <div className={styles.update}>
                                <label htmlFor="input_file">
                                    <i className="fal fa-camera"></i>
                                </label>
                                <input
                                    type="file"
                                    id="input_file"
                                    {...register("image")}
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleFileInputChange}
                                ></input>
                            </div>
                        </div>
                        <div className={styles.name}>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={handleNameChange}
                                    onKeyDown={handleNameSubmit}
                                    onBlur={() => setIsEditingName(false)}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <span>{freshUserData?.name || userCurrent.name}</span>
                                    <div className={styles.update} onClick={handleNameEdit}>
                                        <i className="fal fa-edit"></i>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className={styles.phone}>
                            {isEditingPhone ? (
                                <input
                                    type="text"
                                    value={newPhone}
                                    onChange={handlePhoneChange}
                                    onKeyDown={handlePhoneSubmit}
                                    onBlur={() => setIsEditingPhone(false)}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <span>{freshUserData?.phone || userCurrent.phone}</span>
                                    <div className={styles.update} onClick={handlePhoneEdit}>
                                        <i className="fal fa-edit"></i>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}
                    </div>

                    <div className={styles.btn}>
                        <button 
                            type="button" 
                            className={`${styles.cancel}`} 
                            onClick={handleClose}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className={`${styles.search}`}
                            disabled={!selectedFile && 
                                (!newName || newName === freshUserData?.name) && 
                                (!newPhone || newPhone === freshUserData?.phone)}
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfile;
