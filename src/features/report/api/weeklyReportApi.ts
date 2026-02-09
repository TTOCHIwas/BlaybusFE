import { apiClient } from '@/shared/api/base';
import type { ReportData } from '@/features/report/model/types';
import { getMonth, getWeekOfMonth, getYear, parseISO } from 'date-fns';
import { asRecord, asString, asOptionalString, pick, isRecord } from '@/shared/api/parse';

const normalizeReport = (raw: unknown): ReportData => {
  const obj = asRecord(raw, 'WeeklyReport');
  return {
    id: asOptionalString(pick(obj, ['reportId', 'id']), 'WeeklyReport.id'),
    menteeId: asOptionalString(pick(obj, ['menteeId', 'mentee_id']), 'WeeklyReport.menteeId') ?? '',
    startDate: asString(pick(obj, ['startDate', 'start_date']), 'WeeklyReport.startDate'),
    endDate: asString(pick(obj, ['endDate', 'end_date']), 'WeeklyReport.endDate'),
    totalReview: asString(pick(obj, ['overallFeedback', 'totalReview', 'total_review']), 'WeeklyReport.totalReview'),
    wellDone: asString(pick(obj, ['strengths', 'wellDone', 'well_done']), 'WeeklyReport.wellDone'),
    improvements: asString(
      pick(obj, ['weaknesses', 'improvements', 'improvement', 'need_improvement']),
      'WeeklyReport.improvements'
    ),
  };
};

const isMissing = (value: unknown) => value === undefined || value === null;
const normalizeId = (value: unknown): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return undefined;
};

const resolveReportResponse = async (
  data: unknown,
  fallback?: ReportData,
  fallbackId?: string
): Promise<ReportData> => {
  if (typeof data === 'number' || typeof data === 'string') {
    const id = String(data);
    try {
      return await weeklyReportApi.getById(id);
    } catch {
      if (fallback) return { ...fallback, id };
      throw new Error('WeeklyReportResponse: failed to resolve report by id');
    }
  }
  if ((data === null || data === undefined) && fallbackId) {
    try {
      return await weeklyReportApi.getById(fallbackId);
    } catch {
      if (fallback) return { ...fallback, id: fallbackId };
      throw new Error('WeeklyReportResponse: failed to resolve report by fallback id');
    }
  }
  if (isRecord(data)) {
    const idValue = normalizeId(pick(data, ['reportId', 'id']));
    const menteeId = pick(data, ['menteeId', 'mentee_id']);
    const startDate = pick(data, ['startDate', 'start_date']);
    const endDate = pick(data, ['endDate', 'end_date']);
    const overall = pick(data, ['overallFeedback', 'totalReview', 'total_review']);
    const strengths = pick(data, ['strengths', 'wellDone', 'well_done']);
    const weaknesses = pick(data, ['weaknesses', 'improvements', 'improvement', 'need_improvement']);

    const isIncomplete =
      isMissing(menteeId) ||
      isMissing(startDate) ||
      isMissing(endDate) ||
      isMissing(overall) ||
      isMissing(strengths) ||
      isMissing(weaknesses);

    if (isIncomplete && idValue) {
      try {
        return await weeklyReportApi.getById(idValue);
      } catch {
        if (fallback) return { ...fallback, id: idValue };
      }
    }
  }
  try {
    return normalizeReport(data);
  } catch {
    if (fallback) {
      const idValue = isRecord(data) ? normalizeId(pick(data, ['reportId', 'id'])) : undefined;
      return { ...fallback, id: idValue ?? fallback.id };
    }
    throw new Error('WeeklyReportResponse: failed to normalize report');
  }
};

const toRequestDto = (payload: ReportData) => {
  const date = payload.startDate ? parseISO(payload.startDate) : new Date();
  const reportYear = getYear(date);
  const reportMonth = getMonth(date) + 1;
  const weekNumber = getWeekOfMonth(date, { weekStartsOn: 0 });

  return {
    menteeId: payload.menteeId,
    reportYear,
    reportMonth,
    weekNumber,
    startDate: payload.startDate,
    endDate: payload.endDate,
    overallFeedback: payload.totalReview,
    strengths: payload.wellDone,
    weaknesses: payload.improvements,
  };
};

export const weeklyReportApi = {
  list: async (params: { year: number; month: number; menteeId?: string }): Promise<ReportData[]> => {
    const data = await apiClient.get('/weekly-reports', { params });
    const obj = asRecord(data, 'WeeklyReportPage');
    const list = Array.isArray(obj.content) ? obj.content : Array.isArray(data) ? data : [];
    return list.map(normalizeReport);
  },

  getById: async (reportId: string): Promise<ReportData> => {
    const data = await apiClient.get(`/weekly-reports/${reportId}`);
    const obj = asRecord(data, 'WeeklyReportDetail');
    const report = obj.report ?? obj;
    return normalizeReport(report);
  },

  getByStartDate: async (startDate: string, menteeId?: string): Promise<ReportData | undefined> => {
    const [yearStr, monthStr] = startDate.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const list = await weeklyReportApi.list({ year, month, menteeId });
    return list.find((r) => r.startDate === startDate);
  },

  create: async (payload: ReportData): Promise<ReportData> => {
    const data = await apiClient.post('/mentor/weekly-report', toRequestDto(payload));
    return resolveReportResponse(data, payload);
  },

  update: async (reportId: string, payload: ReportData): Promise<ReportData> => {
    const data = await apiClient.patch(`/mentor/weekly-report/${reportId}`, toRequestDto(payload));
    return resolveReportResponse(data, payload, reportId);
  },

  remove: async (reportId: string): Promise<void> => {
    await apiClient.delete(`/mentor/weekly-report/${reportId}`);
  },
};
