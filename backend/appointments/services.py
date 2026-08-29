import datetime
import zoneinfo
from django.db import transaction, models
from django.utils import timezone
from salons.models import Salon, Service, Staff, WorkingHour, StaffLeave
from .models import Appointment

IST = zoneinfo.ZoneInfo('Asia/Kolkata')

class AvailabilityEngine:
    @staticmethod
    def get_available_slots(salon_id, service_id, staff_id, date_str):
        try:
            target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return {
                'success': False,
                'message': 'Invalid date format. Use YYYY-MM-DD.',
                'slots': []
            }

        # 1. Fetch Service & duration
        try:
            service = Service.objects.get(id=service_id, salon_id=salon_id, is_active=True)
        except Service.DoesNotExist:
            return {'success': False, 'message': 'Service not found.', 'slots': []}

        # 2. Check Working Hours for target date
        day_of_week = target_date.weekday() # 0 = Monday, 6 = Sunday
        working_hour = WorkingHour.objects.filter(salon_id=salon_id, day_of_week=day_of_week).first()

        if not working_hour or not working_hour.is_open:
            return {
                'success': True,
                'message': 'Salon is closed on this day.',
                'is_closed': True,
                'slots': []
            }

        # 3. Check Staff Leave
        is_on_leave = StaffLeave.objects.filter(
            staff_id=staff_id,
            start_date__lte=target_date,
            end_date__gte=target_date
        ).exists()

        if is_on_leave:
            return {
                'success': True,
                'message': 'Staff member is on leave on this date.',
                'is_on_leave': True,
                'slots': []
            }

        # 4. Fetch existing non-cancelled appointments for this staff member on target date
        existing_appointments = Appointment.objects.filter(
            staff_id=staff_id,
            appointment_date=target_date,
            status__in=[Appointment.Status.PENDING, Appointment.Status.CONFIRMED, Appointment.Status.COMPLETED]
        )

        # 5. Generate candidate time slots from opening_time to closing_time
        opening_time = working_hour.opening_time
        closing_time = working_hour.closing_time
        service_duration = datetime.timedelta(minutes=service.duration_minutes)

        slots = []
        step_minutes = 30 # Generate slots every 30 mins

        now = timezone.now().astimezone(IST)
        curr_datetime = datetime.datetime.combine(target_date, opening_time, tzinfo=IST)
        close_datetime = datetime.datetime.combine(target_date, closing_time, tzinfo=IST)

        # If the requested date is in the past, return no slots
        if target_date < now.date():
            return {
                'success': True,
                'message': 'Cannot book appointments for past dates.',
                'is_closed': False,
                'is_on_leave': False,
                'slots': []
            }

        while curr_datetime + service_duration <= close_datetime:
            slot_start = curr_datetime.time()
            slot_end = (curr_datetime + service_duration).time()

            # For TODAY only: hide every slot whose start time is earlier than or equal to current time
            if target_date == now.date() and curr_datetime <= now:
                curr_datetime += datetime.timedelta(minutes=step_minutes)
                continue

            # Check overlap with existing appointments (already-booked slots remain disabled)
            is_available = True
            for apt in existing_appointments:
                # Overlap if max(slot_start, apt.start_time) < min(slot_end, apt.end_time)
                if max(slot_start, apt.start_time) < min(slot_end, apt.end_time):
                    is_available = False
                    break

            slots.append({
                'start_time': slot_start.strftime('%H:%M'),
                'end_time': slot_end.strftime('%H:%M'),
                'display_time': curr_datetime.strftime('%I:%M %p'),
                'available': is_available
            })

            curr_datetime += datetime.timedelta(minutes=step_minutes)

        return {
            'success': True,
            'message': 'Slots calculated successfully',
            'is_closed': False,
            'is_on_leave': False,
            'slots': slots
        }
