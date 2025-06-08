import { inject } from "@angular/core"
import { SpinnerService } from "../services/spinner.service"
import { finalize } from "rxjs";
import { HttpInterceptorFn } from "@angular/common/http";

export const SpinnerInterceptor: HttpInterceptorFn = (req, next) => {
    const spinnerService = inject(SpinnerService);
    spinnerService.show();
    return next(req).pipe(
        finalize(() => spinnerService.hide())
    )
}