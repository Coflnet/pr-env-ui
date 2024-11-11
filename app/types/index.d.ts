export interface PreviewEnvironment {
  id: string;
  name: string;
  displayName: string;
  owner: string;
  gitSettings: GitSettings;
  containerSettings: ContainerSettings;
  applicationSettings: ApplicationSettings;
}

export interface GitSettings {
  organization: string;
  repository: string;
}

export interface ContainerSettings {
  registry: string;
  image: string;
}

export interface ApplicationSettings {
  port: number;
  hostname: string;
}
