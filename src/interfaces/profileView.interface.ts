export interface IViewerInfo {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
}

export interface IProfileViewResponse {
  profileViewId: string;
  viewerId: string;
  viewedId: string;
  createdAt: Date;
  //updatedAt: Date;
  Viewer?: IViewerInfo;
}
