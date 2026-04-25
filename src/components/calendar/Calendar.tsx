"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    recordType?: string;
    healthStatus?: string;
    recordTime?: string;
    detailNote?: string;
    aiComment?: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [healthStatus, setHealthStatus] = useState("정상");
  const [eventStartDate, setEventStartDate] = useState("");
  const [bowelTime, setBowelTime] = useState("14:30");
  const [bowelSize, setBowelSize] = useState("Big");
  const [detailNote, setDetailNote] = useState("");
  const [aiComment, setAiComment] = useState("최근 식사량이 감소했습니다.");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const statusToCalendar: Record<string, string> = {
    정상: "Success",
    주의: "Warning",
    위험: "Danger",
  };

  useEffect(() => {
    // Initialize with some events
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger", healthStatus: "위험" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success", healthStatus: "정상" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { calendar: "Warning", healthStatus: "주의" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setHealthStatus(event.extendedProps.healthStatus || "정상");
    setBowelTime(event.extendedProps.recordTime || "14:30");
    setBowelSize(event.extendedProps.recordType || "Big");
    setDetailNote(event.extendedProps.detailNote || "");
    setAiComment(
      event.extendedProps.aiComment || "최근 식사량이 감소했습니다."
    );
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    const mappedCalendar = statusToCalendar[healthStatus] || "Success";
    const eventDisplayTitle = detailNote.trim() || "식사/배변 기록";
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventDisplayTitle,
                start: eventStartDate,
                extendedProps: {
                  calendar: mappedCalendar,
                  recordType: bowelSize,
                  healthStatus,
                  recordTime: bowelTime,
                  detailNote,
                  aiComment,
                },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventDisplayTitle,
        start: eventStartDate,
        allDay: true,
        extendedProps: {
          calendar: mappedCalendar,
          recordType: bowelSize,
          healthStatus,
          recordTime: bowelTime,
          detailNote,
          aiComment,
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventStartDate("");
    setHealthStatus("정상");
    setBowelTime("14:30");
    setBowelSize("Big");
    setDetailNote("");
    setAiComment("최근 식사량이 감소했습니다.");
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Add Health Record
            </h5>
          </div>
          <div className="mt-8">
            <div className="mb-6 overflow-hidden rounded-xl">
              <Image
                src="/images/Dogs/default_dog.png"
                alt="강아지"
                width={500}
                height={250}
                className="mx-auto h-auto w-full max-w-[250px] object-contain"
              />
            </div>
            <div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Record Type
                </label>
                <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      식사
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                      185g
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        배변 활동 시간
                      </label>
                      <input
                        type="time"
                        value={bowelTime}
                        onChange={(e) => setBowelTime(e.target.value)}
                        className="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        배변 크기
                      </label>
                      <select
                        value={bowelSize}
                        onChange={(e) => setBowelSize(e.target.value)}
                        className="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                      >
                        <option value="Big">Big</option>
                        <option value="Small">Small</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Health Status
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {["정상", "주의", "위험"].map((status) => (
                  <label
                    key={status}
                    className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="radio"
                      name="health-status"
                      value={status}
                      checked={healthStatus === status}
                      onChange={() => setHealthStatus(status)}
                      className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Record Date
              </label>
              <input
                id="record-date"
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Detail Note
              </label>
              <textarea
                value={detailNote}
                onChange={(e) => setDetailNote(e.target.value)}
                rows={3}
                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                AI Comment
              </label>
              <textarea
                value={aiComment}
                onChange={(e) => setAiComment(e.target.value)}
                rows={2}
                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              Save Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
