export type Account = {
  id: number;
  companyName: string;
  address: {
    unit: string;
    address: string;
    fullAddress: string;
    shortAddress: string;
    city: string;
    postalCode: string;
    region: Region;
    country: Country;
  };
  squareLogo: {
    id: number;
    name: string;
    s3Key: string;
  };
  outboundEmail?: string;
  hstNumber?: string;
  sendPaymentReminders: boolean;
  sendJobReminders: boolean;
};

export type CreateFile = {
  file: null | ArrayBuffer | string;
  extension: string;
  mimeType: string;
};

export type CreateAccount = {
  companyName?: string;
  unit?: string | null;
  address?: string;
  city?: string;
  postalCode?: string;
  regionId?: number;
  countryId?: number;
  outboundEmail?: string;
  hstNumber?: string | null;
  squareLogoFile?: CreateFile | null;
  sendPaymentReminders?: boolean;
  sendJobReminders?: boolean;
};

export type UserType = {
  id: number;
  type: string;
  description: string;
};

export type ClientProfile = {
  id: number;
  accountId: number;
  unsubscribeJobReminders: boolean;
  subscribeJobReminders: boolean;
  subscribeSolicitations: boolean;
  confirmJob: boolean;
  emailId: number;
  jobId: number;
  pages: {
    unsubscribe: boolean;
    subscribe: boolean;
    confirm: boolean;
  };
};

export type UserLogin = {
  id: number;
  permissions: {
    isAdmin: boolean;
    isCleaner: boolean;
    isReceptionist: boolean;
    isClient: boolean;
    jobSchedule: {
      canEdit: boolean;
    };
    pages: {
      clients: boolean;
      client: boolean;
      addresses: boolean;
      address: boolean;
      teams: boolean;
      teamsCalendar: boolean;
      team: boolean;
      users: boolean;
      user: boolean;
      jobs: boolean;
      job: boolean;
      jobSchedule: boolean;
      dailyCalendar: boolean;
      dailyJobs: boolean;
      clockInOut: boolean;
      summary: boolean;
      unsubscribe: boolean;
      settings: boolean;
    };
  };
  fullName: string;
  initals: string;
  userType: UserType;
  teamId?: number;
  clockedIn?: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  address?: string;
  cellPhone?: string;
  homePhone?: string;
  email?: string;
  userType: UserType;
  teamId?: number;
  startDate: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactEmail?: string;
  createdBy?: string;
  createdAt?: string;
  clockedIn?: boolean;
};

export type CreateUser = {
  id?: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  cellPhone?: string;
  homePhone?: string;
  email?: string;
  userTypeId?: number;
  startDate?: string;
  password?: string;
  confirmPassword?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactEmail?: string;
};

export type CreateClockOut = {
  id: number;
  dateTime?: string;
  useCurrentTime: boolean;
  lateClockOutReason?: string;
};

export type CreateClockIn = {
  dateTime?: string;
  useCurrentTime: boolean;
  reason?: string;
  lateClockInReason?: string;
};

export type TimeCard = {
  id: number;
  userId: number;
  date: string;
  clockIn: string;
  clockOut: string;
  clockInBy: string;
  clockedOutBy: string;
  lateClockOutReason: string;
  lateClockInReason: string;
};

export type CreateEmailContact = {
  id?: number;
  email: string;
  main: boolean;
};

export type EmailContact = {
  id: number;
  email: string;
  main: boolean;
};

export type CreatePhoneContact = {
  id?: number;
  number: string;
  typeId: number;
  type: string;
  main: boolean;
};

export type PhoneContact = {
  id: number;
  number: string;
  typeId: number;
  type: string;
  main: boolean;
};

export type Country = {
  id: number;
  name: string;
  abbreviation: string;
};

export type Region = {
  id: number;
  name: string;
  abbreviation: string;
};

export type Address = {
  id: number;
  client: Client;
  unit?: string;
  streetNumber: string;
  streetName: string;
  longitude: number;
  latitude: number;
  postalCode: string;
  city: string;
  country: string;
  region: string;
  fullAddress: string;
  shortAddress: string;
  jobCount: number;
  createdBy: string;
  createdAt: string;
  latestCompletedJob?: string;
  nextJob?: string;
};

export type VerifiedAddress = {
  streetNumber?: string;
  streetName?: string;
  longitude?: number;
  latitude?: number;
  postalCode?: string;
  city?: string;
  country?: string;
  region?: string;
  unit?: string;
  formatted: string;
};

export type FoundAddress = {
  name: string;
};

export type CreateAddress = {
  clientId?: number;
  id?: number;
  unit?: string;
  streetNumber?: string;
  streetName?: string;
  postalCode?: string;
  city?: string;
  countryId?: number;
  regionId?: number;
  longitude?: number;
  latitude?: number;
};

export type CreatedClient = {
  clientId: number;
  addressId?: number;
};

export type CreatedAddress = {
  id: number;
};

export type CreatedJob = {
  id: number;
};

export type Client = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  emails: Array<EmailContact>;
  phones: Array<PhoneContact>;
  addresses: Array<Address>;
  createdBy: string;
  createdAt: string;
  owing: number;
  jobCount: number;
  coorperate: number;
  allowJobReminders: boolean;
  allowSolicitaions: boolean;
};

export type ClientSearch = {
  searchFilter?: string;
  clientName?: string;
  emails?: Array<string>;
  phones?: Array<string>;
  limit?: number;
  excludeId?: number;
};

export type AddressSearch = {
  searchFilter?: string;
  clientId?: number;
  unit?: string;
  streetName?: string;
  streetNumber?: string;
  postalCode?: string;
  limit?: number;
  excludeId?: number;
  hasClient?: boolean;
};

export type CreateClient = {
  firstName: string;
  lastName?: string;
  fullName?: string;
  coorperate?: boolean;
  emails?: Array<CreateEmailContact>;
  phones?: Array<CreatePhoneContact>;
  address?: CreateAddress;
};

export type Team = {
  id: number;
  name: string;
  hourlyProduction: number;
  members: Array<User>;
  schedules?: Array<TeamSchedule>;
  colourId: number;
  hexCode: string;
  createdAt: string;
  createdBy: string;
};

export type FetchTeamsParams = {
  searchFilter?: string;
  scheduleDate?: string;
  userId?: number;
};

export type CreateTeam = {
  id?: number;
  name?: string;
  hourlyProduction?: number;
  members: Array<User>;
  colourId?: number;
};

export type DailyTeamScheduleSearch = {
  date: string;
  teamId?: number;
};

export type TeamScheduleSearch = {
  date: string;
  teamId: number;
};

export type TeamSchedule = {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
  hexCode: string;
  team: Team;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  date?: string;
};

export type CreateTeamSchedule = {
  id?: number;
  teamId?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  notes?: string;
  updateType?: number;
  date?: string;
};

export type DeleteTeamSchedule = {
  updateType?: number;
  date?: string;
};

export type Colour = {
  id: number;
  hexCode: string;
  colour: string;
};

export type DailyTeamSchedule = {
  teamId: number;
  teamName: string;
  schedules: Array<TeamSchedule>;
};

export type DailyAllTeamsSchedule = {
  date: string;
  schedules: Array<TeamSchedule>;
};

export type CreateJob = {
  id?: number;
  addressId?: number;
  description?: string;
  officeNotes?: string;
  quoteDescription?: string;
  windowDetails?: CreateWindow;
  eavesDetails?: CreateEavestrough;
  otherDetails?: CreateOther;
  windowQuotes?: Array<CreateWindow>;
  eavesQuotes?: Array<CreateEavestrough>;
  otherQuotes?: Array<CreateOther>;
  includeTax: boolean;
  includeQuoteTax: boolean;
  needsInvoice: boolean;
  createdAt?: string;
  isQuote?: boolean;
  paymentType?: PaymentType;
  paymentAmount?: number;
  status?: JobStatus;
};

export type TaskType = {
  id: number;
  type: string;
};

export type SavedFile = {
  id: number;
  name: string;
  s3Key: string;
  mimeType: string;
};

export type Invoice = {
  id: number;
  createdAt: string;
  email?: string;
  file: SavedFile;
};

export type QuoteDocument = {
  id: number;
  s3Key: string;
  createdAt: string;
  email?: string;
};

export type PaymentType = {
  id: number;
  type: string;
};

export type JobPayment = {
  type: string;
  amount: number;
};

export type Photo = {
  id: number;
  title: string;
  date: string;
};

export type Job = {
  id: number;
  taskType: TaskType;
  client: Client;
  status: JobStatus;
  address: Address;
  description?: string;
  subtotal?: number;
  total?: number;
  tax?: number;
  quoteTotal?: number;
  quoteSubtotal?: number;
  quoteTax?: number;
  invoices: Array<Invoice>;
  quotes: Array<QuoteDocument>;
  fullyPaid?: boolean;
  payments?: Array<JobPayment>;
  paymentRemaining?: number;
  startDate?: string;
  endDate?: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  endTime?: string;
  completed: boolean;
  members?: Array<User>;
  windowDetails?: WindowDetails;
  eavesDetails?: EavestroughDetails;
  otherDetails?: OtherDetails;
  windowQuotes?: Array<WindowDetails>;
  eavesQuotes?: Array<EavestroughDetails>;
  otherQuotes?: Array<OtherDetails>;
  hasQuotes?: boolean;
  hasWork?: boolean;
  changeRequests?: RequestJobChanges;
  photos: Array<Photo>;
  createdBy?: string;
  createdAt?: string;
  officeNotes?: string;
  publicNotes?: string;
  includeTax: boolean;
  includeQuoteTax: boolean;
  needsInvoice: boolean;
};

export type Communication = {
  email: string;
  sentAt: string;
  name: string;
  sentBy: string;
  fileId: number;
};

export type JobScheduleType = {
  id: number;
  type: string;
};

export type JobSchedule = {
  job: Job;
  id: number;
  jobId: number;
  team: Team;
  teamId: number;
  address: string;
  date: string;
  startTime: string;
  timeStarted?: string;
  timeFinished?: string;
  userTimeStarted?: string;
  userTimeFinished?: string;
  needsStarting: Array<User>;
  needsFinishing: Array<User>;
  manditoryArriveAfter?: string;
  manditoryArriveBefore?: string;
  preferredArriveAfter?: string;
  preferredArriveBefore?: string;
  type: JobScheduleType;
  endTime: string;
  createdAt: string;
  createdBy: string;
  duration: number;
};

export type CreateJobSchedule = {
  jobId?: number;
  teamId?: number;
  startTime?: string;
  endTime?: string;
  manditoryArriveBefore?: string;
  manditoryArriveAfter?: string;
  preferredArriveBefore?: string;
  preferredArriveAfter?: string;
  freePlacement?: boolean;
  typeId: number;
  date?: string;
  time?: number;
  price?: number;
};

export type StartJobScheduleParams = {
  staffIds: Array<number>;
  time?: string;
  reason?: string;
  jobCompleted?: boolean;
};

export type CreateJobScheduleFromDrag = {
  id: number;
  createJobSchedule: CreateJobSchedule;
  copy?: boolean;
};

export type JobStatus = {
  id: number;
  status: string;
};

export type DailyAllJobSchedule = {
  teamId: number;
  teamColour: string;
  totalProduction: number;
  remainingProduction: number;
  schedules: Array<JobSchedule>;
};

export type JobDailySummary = {
  date: string;
  schedules: Array<DailyAllJobSchedule>;
};

export type PhoneType = {
  id: number;
  type: string;
};

export type ClientPhoneType = {
  id: number;
  default: boolean;
};

export type PresetSubType = {
  id: number;
  type: string;
};

export type JobType = {
  id: number;
  type: string;
  selected?: boolean;
};

export type JobSubType = {
  id: number;
  jobTypeId: number;
  title: string;
  description: string;
};

export type WindowPresetSubType = {
  id: number;
  type: string;
};

export type JobDetails = {
  id?: number;
  window?: CreateWindowDetails;
  eavestrough?: EavestroughDetails;
  other?: OtherDetails;
  title: string;
  description: string;
  officeNotes?: string;
  price: number;
  notes?: string;
};

export type AddressJobDetails = {
  windowDetails: Array<WindowDetails>;
  eavesDetails: Array<EavestroughDetails>;
  otherDetails: Array<OtherDetails>;
  windowQuotes: Array<WindowDetails>;
  eavesQuotes: Array<EavestroughDetails>;
  otherQuotes: Array<OtherDetails>;
};

export type WindowDetails = {
  id: number;
  price: number;
  description: string;
  subType: JobSubType;
  garage: boolean;
  doors: boolean;
  railings: boolean;
  tracks: boolean;
  cranks: boolean;
  solarPanels: boolean;
  basement: boolean;
  skylights: boolean;
  thirdFloor: boolean;
  frames: boolean;
  screens: boolean;
  sills: boolean;
  notes?: string;
  createdAt: string;
};

export type CreateRequestJobChanges = {
  jobId: number;
  reason: string;
  addIncludeTax?: boolean;
  removeIncludeTax?: boolean;
  windowChanges?: CreateWindowChanges;
  eavesChanges?: CreateEavesChanges;
  customChanges?: CreateCustomChanges;
};

export type WindowChanges = {
  id: number;
  price?: number;
  subType?: JobSubType;
  addGarage: boolean;
  addDoors: boolean;
  addRailings: boolean;
  addTracks: boolean;
  addCranks: boolean;
  addSolarPanels: boolean;
  addBasement: boolean;
  addSkylights: boolean;
  addThirdFloor: boolean;
  addFrames: boolean;
  addScreens: boolean;
  addSills: boolean;
  removeGarage: boolean;
  removeDoors: boolean;
  removeRailings: boolean;
  removeTracks: boolean;
  removeCranks: boolean;
  removeSolarPanels: boolean;
  removeBasement: boolean;
  removeSkylights: boolean;
  removeThirdFloor: boolean;
  removeFrames: boolean;
  removeScreens: boolean;
  removeSills: boolean;
};

export type EavesChanges = {
  id: number;
  price?: number;
  subType?: JobSubType;
  addValleys: boolean;
  addSecondBuilding: boolean;
  addFlatRoofs: boolean;
  removeValleys: boolean;
  removeSecondBuilding: boolean;
  removeFlatRoofs: boolean;
};

export type CustomChanges = {
  id: number;
  price?: number;
};

export type FetchRequestJobChangesParams = {
  jobId: number;
};

export type RequestJobChanges = {
  id: number;
  reason: string;
  createdById: number;
  createdBy: string;
  createdAt: string;
  windowRequest?: WindowChanges;
  eavesRequest?: EavesChanges;
  customRequest?: CustomChanges;
  addIncludeTax?: boolean;
  removeIncludeTax?: boolean;
};

export type ConfirmRequestChanges = {
  windowChanges?: ConfirmWindowChanges;
  eavesChanges?: ConfirmEavesChanges;
  customChanges?: ConfirmCustomChanges;
  addIncludeTax?: boolean;
  removeIncludeTax?: boolean;
};

export type ChangeStatus = {
  jobId: number;
  statusId: number;
};

export type ConfirmWindowChanges = {
  price?: boolean;
  subType?: boolean;
  addGarage?: boolean;
  addDoors?: boolean;
  addRailings?: boolean;
  addTracks?: boolean;
  addCranks?: boolean;
  addSolarPanels?: boolean;
  addBasement?: boolean;
  addSkylights?: boolean;
  addThirdFloor?: boolean;
  addFrames?: boolean;
  addScreens?: boolean;
  addSills?: boolean;
  removeGarage?: boolean;
  removeDoors?: boolean;
  removeRailings?: boolean;
  removeTracks?: boolean;
  removeCranks?: boolean;
  removeSolarPanels?: boolean;
  removeBasement?: boolean;
  removeSkylights?: boolean;
  removeThirdFloor?: boolean;
  removeFrames?: boolean;
  removeScreens?: boolean;
  removeSills?: boolean;
};

export type ConfirmEavesChanges = {
  price?: boolean;
  subType?: boolean;
  addValleys?: boolean;
  addSecondBuilding?: boolean;
  addFlatRoofs?: boolean;
  removeValleys?: boolean;
  removeSecondBuilding?: boolean;
  removeFlatRoofs?: boolean;
};

export type ConfirmCustomChanges = {
  price?: boolean;
};

export type CreateWindowChanges = {
  price?: number;
  subTypeId?: number;
  addGarage?: boolean;
  addDoors?: boolean;
  addRailings?: boolean;
  addTracks?: boolean;
  addCranks?: boolean;
  addSolarPanels?: boolean;
  addBasement?: boolean;
  addSkylights?: boolean;
  addThirdFloor?: boolean;
  addFrames?: boolean;
  addScreens?: boolean;
  addSills?: boolean;
  removeGarage?: boolean;
  removeDoors?: boolean;
  removeRailings?: boolean;
  removeTracks?: boolean;
  removeCranks?: boolean;
  removeSolarPanels?: boolean;
  removeBasement?: boolean;
  removeSkylights?: boolean;
  removeThirdFloor?: boolean;
  removeFrames?: boolean;
  removeScreens?: boolean;
  removeSills?: boolean;
};

export type CreateEavesChanges = {
  price?: number;
  subTypeId?: number;
  addValleys?: boolean;
  addSecondBuilding?: boolean;
  addFlatRoofs?: boolean;
  removeValleys?: boolean;
  removeSecondBuilding?: boolean;
  removeFlatRoofs?: boolean;
};

export type CreateCustomChanges = {
  price?: number;
};

export type CreateWindowDetails = {
  id?: number;
  price?: number;
  description?: string;
  subTypeId?: number;
  subType?: JobSubType;
  garage?: boolean;
  doors?: boolean;
  railings?: boolean;
  tracks?: boolean;
  cranks?: boolean;
  solarPanels?: boolean;
  basement?: boolean;
  skylights?: boolean;
  thirdFloor?: boolean;
  frames?: boolean;
  screens?: boolean;
  sills?: boolean;
  notes?: string;
};

export type EavestroughDetails = {
  id: number;
  price: number;
  description: string;
  subType: JobSubType;
  valleys: boolean;
  flatRoofs: boolean;
  secondBuilding: boolean;
  notes?: string;
  createdAt: string;
};

export type CreateEavestroughDetails = {
  id?: number;
  price?: number;
  description?: string;
  subTypeId?: number;
  subType?: JobSubType;
  valleys?: boolean;
  flatRoofs?: boolean;
  secondBuilding?: boolean;
  notes?: string;
};

export type OtherDetails = {
  id: number;
  price: number;
  description: string;
  notes?: string;
  createdAt: string;
};

export type CreateWindow = {
  id?: number;
  index?: number;
  subType?: JobSubType;
  notes?: string;
  description?: string;
  garage?: boolean;
  doors?: boolean;
  railings?: boolean;
  tracks?: boolean;
  cranks?: boolean;
  solarPanels?: boolean;
  basement?: boolean;
  skylights?: boolean;
  thirdFloor?: boolean;
  frames?: boolean;
  screens?: boolean;
  sills?: boolean;
  price?: number;
  showToClient?: boolean;
  includeInQuote?: boolean;
};

export type CreateEavestrough = {
  id?: number;
  index?: number;
  description?: string;
  subType?: JobSubType;
  valleys?: boolean;
  flatRoofs?: boolean;
  secondBuilding?: boolean;
  notes?: string;
  price?: number;
  showToClient?: boolean;
  includeInQuote?: boolean;
};

export type CreateOther = {
  id?: number;
  index?: number;
  price?: number;
  description?: string;
  notes?: string;
  showToClient?: boolean;
  includeInQuote?: boolean;
};

export type Quote = {
  id?: number;
  createdAt?: string;
  createdBy?: string;
  client: Client;
  address: Address;
  jobStatus: JobStatus;
  startTime: string;
  endTime: string;
  date: string;
  total: number;
};

export type ValidationError = {
  id: string;
  description: string;
};

export type InvoiceQuoteClient = {
  name?: string;
  address?: string;
  emailId?: number;
  phoneId?: number;
};

export type CreateQuoteDocument = {
  windowData?: Array<CreateWindow>;
  eavesData?: Array<CreateEavestrough>;
  otherData?: Array<CreateOther>;
  includePriceSummary?: boolean;
  notes?: string;
  includeTax?: boolean;
  subtotal?: number;
  tax?: number;
  total?: number;
};

export type CreatePresetJobs = {
  windowJobs?: Array<CreateWindow>;
  eavesJobs?: Array<CreateEavestrough>;
  otherJobs?: Array<CreateOther>;
};

export type QuoteSettings = {
  id: number;
  coorperateFooterNote?: string;
  individualFooterNote?: string;
};

export type InvoiceSettings = {
  id: number;
  coorperateFooterNote?: string;
  individualFooterNote?: string;
};

export type UpdateInvoiceSettings = {
  coorperateFooterNote: string | null;
  individualFooterNote: string | null;
};

export type UpdateQuoteSettings = {
  coorperateFooterNote: string | null;
  individualFooterNote: string | null;
};

export type CreateInvoice = {
  jobId: number;
  client: InvoiceQuoteClient;
  notes?: string;
  emailIds?: Array<number>;
};

export type CreateQuote = {
  jobId: number;
  client: InvoiceQuoteClient;
  notes?: string;
  emailIds?: Array<number>;
};

export type SubmitQuote = {
  jobId: number;
  windowQuotes?: Array<CreateWindow>;
  eavesQuotes?: Array<CreateEavestrough>;
  otherQuotes?: Array<CreateOther>;
};

export type RecordPayment = {
  jobId: number;
  typeId: number;
  amount: number;
  email?: EmailContact;
  tipAmount?: number;
};

export type APICallError = {
  response: any;
  status: number;
};

export type CreateAccountValidation = {
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  region?: string;
  company?: string;
};

export type CreateClockInOutValidation = {
  reason?: string;
  dateTime?: string;
  beforeTime?: string;
};

export type CreateStartStopValidation = {
  reason?: string;
  time?: string;
};

export type CreateEditAddressValidation = {
  client?: string;
  number?: string;
  name?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  region?: string;
  longitude?: string;
  latitude?: string;
};

export type CreateRecordPaymentValidation = {
  paymentType?: string;
  amount?: string;
  email?: string;
};

export type ChangeStatusValidation = {
  status?: string;
};

export type CreateEditClientValidation = {
  firstName?: string;
  lastName?: string;
  emails?: string;
  phones?: string;
  address: CreateEditAddressValidation;
};

export type CreateEditJobScheduleValidation = {
  startTime?: string;
  endTime?: string;
  date?: string;
  team?: string;
  job?: string;
};

export type CreateEditTeamValidation = {
  teamName?: string;
  colour?: string;
  members?: string;
};

export type CustomAddJobScheduleDetails = {
  teamId?: number;
  startTime?: string;
};

export type CreateEditTeamScheduleValidation = {
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  daySelected?: string;
  team?: string;
};

export type CreateWindowValidation = {
  price?: string;
  description?: string;
  subType?: string;
};
export type CreateEavesValidation = {
  price?: string;
  description?: string;
  subType?: string;
};
export type CreateOtherValidation = {
  price?: string;
  description?: string;
};

export type CreateJobValidation = {
  missingInfo?: string;
  description?: string;
  address?: string;
  payment?: string;
  windowErrors?: CreateWindowValidation;
  eavesErrors?: CreateEavesValidation;
  otherErrors?: CreateOtherValidation;
};

export type CreateInvoiceValidation = {
  clientName?: string;
  address?: string;
};

export type CreateQuoteValidation = {
  clientName?: string;
  address?: string;
};

export type CreateUserValidation = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  password?: string;
  confirmPassword?: string;
  startDate?: string;
};

export type RequestJobChangeValidation = {
  reason?: string;
  changes?: string;
};

export type FetchJobsParams = {
  searchFilter?: string;
  clientId?: number;
  taskTypeFilterIds?: Array<number>;
  cleaningTypeFilterIds?: Array<number>;
  addressId?: number;
  completed?: boolean;
  notCompleted?: boolean;
  quoteOnly?: boolean;
  workOnly?: boolean;
  date?: string;
  teamId?: number;
  missed?: boolean;
  minDate?: string;
  maxDate?: string;
  invoiced?: boolean;
  quoted?: boolean;
  notInvoiced?: boolean;
  notQuoted?: boolean;
  onBeforeDate?: string;
  jobsWithoutSchedules?: boolean;
  paid?: boolean;
  notPaid?: boolean;
  limit?: number;
};

export type FetchQuotesParams = {
  searchFilter?: string;
  clientId?: number;
  taskTypeFilterIds?: Array<number>;
  cleaningTypeFilterIds?: Array<number>;
};

export type FetchDailyJobScheduleParams = {
  date?: string;
  jobId?: number;
  teamId?: number;
  clientId?: number;
  missed?: boolean;
  completed?: boolean;
  limit?: number;
  descending?: boolean;
  searchFilter?: string;
};

export type FetchMonthlyJobSchedulesParams = {
  date?: string;
};

export type FetchMonthlyTeamSchedulesParams = {
  date?: string;
};

export type FetchAddressJobsParams = {
  onBeforeDate?: string;
  addressId: number;
};

export type OpenDay = {
  date: string;
  teams: Array<{ teamId: number; teamName: string }>;
};

export type OpenSlot = {
  date: string;
  schedules: Array<{
    teamId: number;
    teamName: string;
    distance: number;
    jobScheduleId: number;
    address: string;
  }>;
};

export type FetchOpeningResults = {
  openDays: Array<OpenDay>;
  openSlots: Array<OpenSlot>;
};

export type FetchOpeningParams = {
  addressId: number;
  minDate: string;
  maxDate: string;
  range: number;
  time?: number;
  price?: number;
};

export type MonthlyCalendarProps = {
  jobId: number;
};

export type SummaryOverview = {
  totalJobsCount: number;
  completedJobsCount: number;
  notCompletedJobsCount: number;
  completedQuotesCount: number;
  notCompletedQuotesCount: number;
  outstandingInvoicesCount: number;
  outstandingQuotesCount: number;
  totalProduction: number;
  totalQuoted: number;
  totalClients: number;
};

export type SummaryTeam = {
  totalJobsCount: number;
  completedJobsCount: number;
  notCompletedJobsCount: number;
  completedQuotesCount: number;
  notCompletedQuotesCount: number;
  outstandingInvoicesCount: number;
  outstandingQuotesCount: number;
  totalProduction: number;
  cashProduction: number;
  totalQuoted: number;
  totalWorkedHours: number;
  totalScheduledWorkHours: number;
  hourlyProduction: number;
};

export type SummaryEmployees = {
  totalWorkedHours: number;
};

export type FetchOverviewParams = {
  minDate?: string;
  maxDate?: string;
};

export type FetchTeamsSummaryParams = {
  minDate?: string;
  maxDate?: string;
  teamId: number;
};

export type FetchEmployeesSummaryParams = {
  minDate?: string;
  maxDate?: string;
  userId: number;
};

export type ChangeStatusParams = {
  jobId: number;
  statusId: number;
  startTime?: string;
  endTime?: string;
  clientAction?: boolean;
};

export type Unsubscribe = {
  jobReminders?: boolean;
};

export type SubscribeEmail = {
  jobReminders?: boolean;
  solicitations?: boolean;
};
