export class TrackUtil {
  /**
   * 把秒数转换成 00:00:00 格式
   * @param seconds - 秒数
   * @returns {string} 时间字符串 或 'Invalid input' 如果输入为空
   */
  static formatSeconds(seconds) {
      if (seconds === undefined || seconds === null) {
          return '';
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return [
          this.padZero(hours),
          this.padZero(minutes),
          this.padZero(secs),
      ].join(':');
  }

  /**
   * 计算实时配速
   * @param speedMps 实时速度（单位：米/秒）
   */
  static calculatePaceFromSpeed(speedMps) {
    if (!speedMps || speedMps <= 0) return '0.0';
    // 将 m/s 转换为 km/h
    const speedKmph = Number((speedMps * 3.6).toFixed(2));
    // 返回以公里/小时为单位的配速
    return speedKmph;
    //   if (!speedMps || speedMps <= 0) return '0\'00';

    //   // 将 m/s 转换为 km/h
    //   const speedKmph = speedMps * 3.6;

    //   // 计算每公里所需的时间（以秒为单位）
    //   const secondsPerKm = 3600 / speedKmph;

    //   // 分离出分钟和秒数
    //   const minutes = Math.floor(secondsPerKm / 60);
    //   let seconds = Math.floor(secondsPerKm % 60); // 舍去小数部分直接取整

    //   // 防止秒数达到 60 的情况
    //   if (seconds === 60) {
    //       seconds = 0;
    //       return `${String(minutes + 1).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
    //   }

    //   // 返回格式化后的配速字符串 "MM:ss"
    //   return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
  }

  /**
   * 计算平均配速
   * @param distanceMeters 总距离（单位：米）
   * @param durationSeconds 总时间（单位：秒）
   */
  static calculateAveragePace(distanceMeters, durationSeconds) {
      if (!distanceMeters || !durationSeconds) return '0\'00';

      // 将距离从米转换为公里
      const distanceKm = distanceMeters / 1000;

      // 计算每公里所需的时间（以秒为单位）
      const secondsPerKm = durationSeconds / distanceKm;

      // 分离出分钟和秒数
      const minutes = Math.floor(secondsPerKm / 60);
      let seconds = Math.floor(secondsPerKm % 60); // 舍去小数部分直接取整

      // 防止秒数达到 60 的情况
      if (seconds === 60) {
          seconds = 0;
          return `${String(minutes + 1).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
      }

      // 返回格式化后的配速字符串
      return `${String(minutes).padStart(2, '0')}'${String(seconds).padStart(2, '0')}`;
  }


  /**
   * 辅助函数，用于在数字前补零
   * @param num - 要格式化的数字
   * @returns {string} 格式化后的字符串
   */
  static padZero(num) {
      return num.toString().padStart(2, '0');
  }

  /**
   * 把米转成公里
   * @param meters - 米数
   * @returns {number | string} 公里数（保留两位小数）或 'Invalid input' 如果输入为空
   */
  static metersToKilometers(meters) {
      if (meters === undefined || meters === null) {
          return '0.0';
      }
      return (Number(meters) / 1000).toFixed(2);
  }

  /**
   * 把Date类型转成 MM-DD HH:mm 格式
   * @param date - Date 对象
   * @returns {string} 格式化后的日期时间字符串 或 'Invalid input' 如果输入为空
   */
  static formatDate(date) {

      if (date === undefined || date === null) {
          console.log("日期转换格式1：" + date)
          return '';
      }
      let dateStr = date.toString()
      dateStr = dateStr.replace(/-/g, "/")
      dateStr = dateStr.replace(/T/g, " ")
      dateStr = dateStr.substring(0, 16)


      return dateStr;
  }

  /**
   * 计算距离（米）
   * @param la1 纬度1
   * @param lo1 经度1
   * @param la2 纬度2
   * @param lo2 经度2
   */
  static distanceMeters(la1, lo1, la2, lo2) {
      const La1 = (la1 * Math.PI) / 180.0;
      const La2 = (la2 * Math.PI) / 180.0;
      const La3 = La1 - La2;
      const Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.sin(La3 / 2) ** 2 + Math.cos(La1) * Math.cos(La2) * Math.sin(Lb3 / 2) ** 2));
      s *= 6378.137; // 地球半径
      s = Math.round(s * 10000) / 10;
      return s;
  }

  /**
   * 计算消耗的卡路里（此方法AI生成，真实的计算方法要素过多，这里仅供演示）
   * @param weight
   * @param durationSeconds
   * @param distanceMeters
   */
  static calculateCaloriesBurned(weight, distanceMeters, durationSeconds) {
      if (!durationSeconds || !distanceMeters) {
          return 0;
      }
      // 将秒转换为分钟
      const durationMinutes = durationSeconds / 60;

      // 计算平均速度 (km/h)
      const speedKmPerHour = (distanceMeters / 1000) / (durationMinutes / 60);

      // 根据速度确定 MET 值
      let met;
      if (speedKmPerHour < 6) {
          met = 5; // 慢走的速度，这里用作默认值
      } else if (speedKmPerHour >= 6 && speedKmPerHour < 8) {
          met = 7;
      } else if (speedKmPerHour >= 8 && speedKmPerHour < 10) {
          met = 9;
      } else if (speedKmPerHour >= 10 && speedKmPerHour < 12) {
          met = 10;
      } else if (speedKmPerHour >= 12 && speedKmPerHour < 14) {
          met = 11;
      } else {
          met = 13; // 更快的速度
      }
      // 计算消耗的卡路里 (kcal)，公式：(MET * weight(kg) * time(min)) / 200
      const caloriesBurned = (met * weight * durationMinutes) / 200;
      return Math.round(caloriesBurned);
  }

}
