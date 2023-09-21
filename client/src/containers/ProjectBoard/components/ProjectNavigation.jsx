import React, { useState } from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "react-use";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  Link as LinkNext, Tooltip, Spacer, Button, Avatar, Modal, ModalHeader, ModalBody,ModalFooter,
  ModalContent, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem, Input, Divider,
} from "@nextui-org/react";
import { MdExtension } from "react-icons/md";
import { BsPlugin } from "react-icons/bs";
import {
  IoAdd, IoAddCircle, IoBarChart, IoCaretBackCircleOutline, IoCaretForwardCircleOutline, IoChevronUpCircle,
  IoEasel, IoEyeOffOutline, IoEyeOutline, IoGridOutline, IoPeople, IoSettings,
} from "react-icons/io5";

import {
  dark, lightGray, primary, secondary
} from "../../../config/colors";
import { APP_VERSION } from "../../../config/settings";
import Container from "../../../components/Container";
import Row from "../../../components/Row";
import Text from "../../../components/Text";
import { HiSearch } from "react-icons/hi";

const sideMaxSize = 220;

const _checkIfActive = (path) => {
  switch (path) {
    case "dashboard":
      if (window.location.pathname.indexOf("dashboard") > -1) return true;
      break;
    case "chart":
      if (window.location.pathname.indexOf("chart") > -1) return true;
      break;
    case "connections":
      if (window.location.pathname.indexOf("connections") > -1) return true;
      break;
    case "projectSettings":
      if (window.location.pathname.indexOf("projectSettings") > -1) return true;
      break;
    case "inviteMembers":
      if (window.location.pathname.indexOf("inviteMembers") > -1) return true;
      break;
    case "members":
      if (window.location.pathname.indexOf("members") > -1) return true;
      break;
    case "settings":
      if (window.location.pathname.indexOf("settings") > -1) return true;
      break;
    case "public":
      if (window.location.pathname.indexOf("public") > -1) return true;
      break;
    case "integrations":
      if (window.location.pathname.indexOf("integrations") > -1) return true;
      break;
    default:
      return false;
  }

  return false;
};

function ProjectNavigation(props) {
  const {
    menuSize, teamId, projectId, project, showDrafts, onSetMenuSize,
    canAccess, projects, onChangeDrafts, onChangeProject, mobile, update,
  } = props;

  const [showUpdate, setShowUpdate] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");

  const { height } = useWindowSize();

  const _onVersionClicked = () => {
    if (update && update.tag_name) {
      setShowUpdate(true);
    }
  };

  const _formatProjectName = (projectName) => {
    if (projectName && projectName.length > 18) {
      return `${project.name.substring(0, 15)}...`;
    }

    return projectName;
  };

  if (mobile) {
    return (
      <nav
        style={styles.mobileMenu}
      >
        <div className="flex items-center justify-center shadow-md bg-content3-foreground w-full backdrop-blur-[10px] backdrop-saturate-[180%]">
          <Container className="flex flex-nowrap justify-between w-full p-2">
            <Row justify="space-between" align="center">
              <Link to={`/${teamId}/${projectId}/dashboard`}>
                <LinkNext className="pointer-events-none">
                  <IoBarChart color={_checkIfActive("dashboard") ? secondary : "white"} size={24} />
                </LinkNext>
              </Link>
              {canAccess("editor") && (
                <Link to={`/${teamId}/${projectId}/connections`}>
                  <LinkNext className="pointer-events-none">
                    <BsPlugin size={24} color={_checkIfActive("connections") ? secondary : "white"} />
                  </LinkNext>
                </Link>
              )}
              <Link to={`/b/${project.brewName}`}>
                <LinkNext className="pointer-events-none">
                  <IoEasel color={_checkIfActive("public") ? secondary : "white"} size={24} />
                </LinkNext>
              </Link>
              {canAccess("editor")
                && (
                  <Link to={`/${teamId}/${projectId}/members`}>
                    <LinkNext className="pointer-events-none">
                      <IoPeople color={_checkIfActive("members") ? secondary : "white"} size={24} />
                    </LinkNext>
                  </Link>
                )}
              {canAccess("admin")
                && (
                  <Link to={`/${teamId}/${projectId}/projectSettings`}>
                    <LinkNext className="pointer-events-none">
                      <IoSettings color={_checkIfActive("projectSettings") ? secondary : "white"} size={24} />
                    </LinkNext>
                  </Link>
                )}
            </Row>
          </Container>
        </div>
      </nav>
    );
  }

  return (
    <div>
      <div className={"bg-content1 flex flex-col justify-start"} style={styles.mainSideMenu(height)}>
        <Row justify="center" align="center" className={"pt-4"}>
          <Popover>
            <PopoverTrigger>
              <div>
                {menuSize === "small" && (
                  // <Tooltip content="Switch project" placement="right">
                  <div>
                    <Text className={"text-default-800"}><IoGridOutline size={28} /></Text>
                  </div>
                  // </Tooltip>
                )}
                {menuSize === "large" && (
                  <Text b className={"text-blue-600"}>{_formatProjectName(project.name)}</Text>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px] max-h-[400px]">
              <div className="flex flex-col gap-2 overflow-y-auto">
                <Input
                  placeholder="Search for a project"
                  fullWidth
                  size="small"
                  variant="bordered"
                  endContent={<HiSearch />}
                  onChange={(e) => setProjectSearch(e.target.value)}
                />
                <Listbox aria-label="Project switch list">
                  {projects.filter((p) => p.name.toLowerCase().indexOf(projectSearch) > -1).map((p) => (
                    <ListboxItem key={p.id} onClick={() => onChangeProject(p.id)}>
                      {p.name}
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>
            </PopoverContent>
          </Popover>
        </Row>
        <Spacer y={8} />
        {canAccess("editor")
          && (
            <Row justify="center" align="center">
              {menuSize === "small" && (
                <Tooltip content="Create a new chart" placement="right">
                  <div>
                    <Link to={`/${teamId}/${projectId}/chart`}>
                      <Text color="primary">
                        <Avatar icon={<IoAddCircle size={28} />} radius="sm" />
                      </Text>
                    </Link>
                  </div>
                </Tooltip>
              )}
              {menuSize === "large" && (
                <Link to={`/${teamId}/${projectId}/chart`} className={"w-full pl-4 pr-4"}>
                  <Button
                    endContent={<IoAdd size={24} />}
                    fullWidth
                    color="primary"
                    className="pointer-events-none"
                    variant="solid"
                  >
                    Create a chart
                  </Button>
                </Link>
              )}
            </Row>
          )}
        <Spacer y={6} />
        <Row justify={menuSize === "large" ? "flex-start" : "center"} align="center">
          <Link to={`/${teamId}/${projectId}/dashboard`}>
            {menuSize === "small" && (
              <Tooltip content="Dashboard" placement="right">
                <div className="pointer-events-none">
                  <Button
                    isIconOnly
                    variant="light"
                    color={_checkIfActive("dashboard") ? "primary" : "default"}
                  >
                    <IoBarChart size={28} />
                  </Button>
                </div>
              </Tooltip>
            )}
            {menuSize === "large" && (
              <Button
                variant="light"
                color={_checkIfActive("dashboard") ? "primary" : "default"}
                startContent={<IoBarChart size={24} />}
                className="pointer-events-none"
              >
                Dashboard
              </Button>
            )}
          </Link>
        </Row>
        {canAccess("editor") && (
          <>
            <Spacer y={1} />
            <Row justify={menuSize === "large" ? "flex-start" : "center"}>
              <Link to={`/${teamId}/${projectId}/connections`}>
                {menuSize === "small" && (
                  <Tooltip content="Connections" placement="right">
                    <div className="pointer-events-none">
                      <Button
                        isIconOnly
                        variant="light"
                        color={_checkIfActive("connections") ? "primary" : "default"}
                      >
                        <BsPlugin size="28" />
                      </Button>
                    </div>
                  </Tooltip>
                )}
                {menuSize === "large" && (
                  <Button
                    variant="light"
                    color={_checkIfActive("connections") ? "primary" : "default"}
                    startContent={<BsPlugin size="24" />}
                    className="pointer-events-none"
                  >
                    Connections
                  </Button>
                )}
              </Link>
            </Row>
          </>
        )}

        <Spacer y={1} />
        <Row justify={menuSize === "large" ? "flex-start" : "center"} align="center">
          <Link to={`/b/${project.brewName}`}>
            <LinkNext className={`${_checkIfActive("public") ? "text-blue-600" : "text-default-800"}`}>
              {menuSize === "small" && (
                <Tooltip content="Dashboard report" placement="right">
                  <div className="pointer-events-none">
                    <Button
                      isIconOnly
                      variant="light"
                      color={_checkIfActive("public") ? "primary" : "default"}
                    >
                      <IoEasel size={28} />
                    </Button>
                  </div>
                </Tooltip>
              )}
              {menuSize === "large" && (
                <Button
                  variant="light"
                  color={_checkIfActive("public") ? "primary" : "default"}
                  startContent={<IoEasel size={24} />}
                  className="pointer-events-none"
                >
                  Dashboard report
                </Button>
              )}
            </LinkNext>
          </Link>
        </Row>

        {canAccess("admin") && (
          <>
            <Spacer y={1} />
            <Row justify={menuSize === "large" ? "flex-start" : "center"}>
              <Link to={`/${teamId}/${projectId}/projectSettings`}>
                {menuSize === "small" && (
                  <Tooltip content="Project settings" placement="right">
                    <div className="pointer-events-none">
                      <Button
                        isIconOnly
                        variant="light"
                        color={_checkIfActive("projectSettings") ? "primary" : "default"}
                      >
                        <IoSettings size={28} />
                      </Button>
                    </div>
                  </Tooltip>
                )}
                {menuSize === "large" && (
                  <Button
                    variant="light"
                    color={_checkIfActive("projectSettings") ? "primary" : "default"}
                    startContent={<IoSettings size={24} />}
                    className="pointer-events-none"
                  >
                    Project settings
                  </Button>
                )}
              </Link>
            </Row>
          </>
        )}
        <Spacer y={4} />
        <Divider />
        <Spacer y={4} />
        {canAccess("editor") && (
          <>
            <Row justify={menuSize === "large" ? "flex-start" : "center"}>
              <Link to={`/${teamId}/${projectId}/members`}>
                {menuSize === "small" && (
                  <Tooltip content="Team members" placement="right">
                    <div className="pointer-events-none">
                      <Button
                        isIconOnly
                        variant="light"
                        color={_checkIfActive("members") ? "primary" : "default"}
                      >
                        <IoPeople size={28} />
                      </Button>
                    </div>
                  </Tooltip>
                )}
                {menuSize === "large" && (
                  <Button
                    variant="light"
                    color={_checkIfActive("members") ? "primary" : "default"}
                    startContent={<IoPeople size={24} />}
                    className="pointer-events-none"
                  >
                    Team members
                  </Button>
                )}
              </Link>
            </Row>
            <Spacer y={1} />
            <Row justify={menuSize === "large" ? "flex-start" : "center"}>
              <Link to={`/${teamId}/${projectId}/integrations`}>
                {menuSize === "small" && (
                  <Tooltip content="Integrations" placement="right">
                    <div className="pointer-events-none">
                      <Button
                        isIconOnly
                        variant="light"
                        color={_checkIfActive("integrations") ? "primary" : "default"}
                      >
                        <MdExtension size={28} />
                      </Button>
                    </div>
                  </Tooltip>
                )}
                {menuSize === "large" && (
                  <Button
                    variant="light"
                    color={_checkIfActive("integrations") ? "primary" : "default"}
                    startContent={<MdExtension size={24} />}
                    className="pointer-events-none"
                  >
                    Integrations
                  </Button>
                )}
              </Link>
            </Row>
          </>
        )}
        <Spacer y={3} />
        <Row justify={menuSize === "large" ? "flex-start" : "center"} align="center">
          {_checkIfActive("dashboard") && canAccess("editor") && (
            <Tooltip
              content={showDrafts ? "Click to hide drafts" : "Click to show drafts"}
              placement="right"
            >
              {menuSize === "small" && (
                <div>
                  <Button
                    isIconOnly
                    variant="light"
                    color="default"
                    onClick={() => onChangeDrafts(!showDrafts)}
                  >
                    {showDrafts ? (<IoEyeOutline size={28} />) : (<IoEyeOffOutline size={28} />)}
                  </Button>
                </div>
              )}
              {menuSize === "large" && (
                <div>
                  <Button
                    variant="light"
                    color="default"
                    onClick={() => onChangeDrafts(!showDrafts)}
                    startContent={showDrafts ? (<IoEyeOutline size={24} />) : (<IoEyeOffOutline size={24} />)}
                  >
                    {showDrafts ? "Show drafts" : "Hide drafts"}
                  </Button>
                </div>
              )}
            </Tooltip>
          )}
        </Row>
        {menuSize === "small" && <Spacer y={1} />}
        {menuSize === "large" && <Spacer y={3} />}
        {menuSize === "large" && (
          <Row justify="flex-end" align="center" className={"mr-5"}>
            <Tooltip content="Click to collapse menu" placement="right">
              <Button
                isIconOnly
                variant="light"
                color="default"
                onClick={() => onSetMenuSize(70)}
              >
                <IoCaretBackCircleOutline size={28} />
              </Button>
            </Tooltip>
          </Row>
        )}
        {menuSize === "small" && (
          <Row justify="center" align="center">
            <Tooltip content="Click to expand menu" placement="right">
              <Button
                isIconOnly
                variant="light"
                color="default"
                onClick={() => onSetMenuSize(sideMaxSize)}
              >
                <IoCaretForwardCircleOutline size={28} />
              </Button>
            </Tooltip>
          </Row>
        )}
        <div style={styles.absoluteLogo} className="flex justify-center items-center">
          {menuSize !== "small" && (
            <LinkNext
              href={((!update || !update.tag_name) && `https://github.com/chartbrew/chartbrew/releases/tag/${APP_VERSION}`) || "#"}
              target={(!update || !update.tag_name) && "_blank"}
              rel="noopener noreferrer"
              onClick={_onVersionClicked}
              style={{ color: "white" }}
              title={(update && update.tag_name && "New version available") || "Current Chartbrew version"}
            >
              <Text b className={"text-default-800 text-[10px]"} style={menuSize !== "small" ? styles.cbVersion : styles.cbVersionCollapsed}>
                {update && update.tag_name && (
                  <IoChevronUpCircle color={secondary} />
                )}
                Chartbrew
                { ` ${APP_VERSION || "v3.0.0"}`}
              </Text>
            </LinkNext>
          )}
          {menuSize === "small" && (
            <LinkNext
              href={((!update || !update.tag_name) && `https://github.com/chartbrew/chartbrew/releases/tag/${APP_VERSION}`) || "#"}
              target={(!update || !update.tag_name) && "_blank"}
              rel="noopener noreferrer"
              onClick={_onVersionClicked}
              style={{ color: "white" }}
              title={(update && update.tag_name && "New version available") || "Current Chartbrew version"}
            >
              <Text b className={"text-default-800 text-[10px]"} style={menuSize !== "small" ? styles.cbVersion : styles.cbVersionCollapsed}>
                {update && update.tag_name && (
                  <IoChevronUpCircle color={secondary} />
                )}
                {APP_VERSION || "v3.0.0"}
              </Text>
            </LinkNext>
          )}
        </div>
      </div>

      <Modal isOpen={showUpdate} closeButton onClose={() => setShowUpdate(false)}>
        <ModalContent>
          <ModalHeader>
            <Text size="h4">{`${update.tag_name} is available`}</Text>
          </ModalHeader>
          <ModalBody>
            <ReactMarkdown>{update.body}</ReactMarkdown>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="warning"
              auto
              onClick={() => setShowUpdate(false)}
            >
              Close
            </Button>
            <LinkNext
              href={`https://github.com/chartbrew/chartbrew/releases/tag/${update.tag_name}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                auto
              >
                Check the release
              </Button>
            </LinkNext>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

ProjectNavigation.propTypes = {
  teamId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  onSetMenuSize: PropTypes.func.isRequired,
  canAccess: PropTypes.func.isRequired,
  onChangeDrafts: PropTypes.func.isRequired,
  onChangeProject: PropTypes.func.isRequired,
  menuSize: PropTypes.string,
  showDrafts: PropTypes.bool,
  mobile: PropTypes.bool,
  update: PropTypes.object,
};

ProjectNavigation.defaultProps = {
  menuSize: "large",
  showDrafts: true,
  mobile: false,
  update: {},
};

const styles = {
  container: {
    zIndex: 10,
  },
  sideMenu: {
    backgroundColor: primary,
  },
  mainContent: {
    backgroundColor: lightGray,
  },
  absoluteLogo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    padding: 5,
    borderRadius: 0,
  },
  cbVersion: {
    verticalAlign: "center",
    padding: 4,
  },
  cbVersionCollapsed: {
    verticalAlign: "center",
  },
  absoluteCollapse: (menuSize) => ({
    position: "absolute",
    bottom: menuSize === "small" ? 35 : 35,
    width: "100%",
  }),
  absoluteDrafts: {
    position: "absolute",
    bottom: 110,
    width: "100%",
  },
  teamSettings: {
    padding: 20,
    paddingLeft: 30,
  },
  draftsHeader: {
    color: "#91A3A2",
    fontSize: 12,
  },
  centered: {
    textAlign: "center",
  },
  mainSideMenu: (height) => ({
    minHeight: height,
    borderRadius: 0,
  }),
  mobileMenu: {
    bottom: 0,
    height: "60px",
    position: "sticky",
    zIndex: 9999,
    backgroundColor: dark,
  },
};

export default withRouter(ProjectNavigation);